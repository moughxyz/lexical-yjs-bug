import { useCallback, useEffect, useMemo, useState } from "react"
import * as Y from "yjs"
import { DocState } from "./DocState"
import { YDocMap } from "./YDocMap"
import { Editor } from "./Editor"
import { arrayToBinaryString, binaryStringToArray } from "./utils"

const DocID = "doc-123"

export default function App() {
  const [docState, setDocState] = useState<DocState | null>(null)

  const docMap = useMemo(() => {
    const map: YDocMap = new Map<string, Y.Doc>()
    return map
  }, [])

  const createInitialDocState = useCallback(() => {
    const newDocState = new DocState((message: Uint8Array) => {
      console.log("Pushing update to local storage")

      const updatesString = localStorage.getItem("updates") || "[]"
      const updates = JSON.parse(updatesString)
      updates.push(arrayToBinaryString(message))

      localStorage.setItem("updates", JSON.stringify(updates))
    })

    return newDocState
  }, [DocID, docMap])

  useEffect(() => {
    if (docState) {
      return
    }

    const newDocState = createInitialDocState()
    docMap.set(DocID, newDocState.getDoc())
    setDocState(newDocState)

    setTimeout(() => {
      const updatesString = localStorage.getItem("updates") || "[]"
      console.log("Repopulating from local storage")
      const updates = JSON.parse(updatesString).map((update: string) => {
        return binaryStringToArray(update)
      })
      for (const update of updates) {
        newDocState.receiveUpdate(update)
      }
    }, 250)
  }, [createInitialDocState, docMap, docState])

  if (!docState) {
    return null
  }

  return (
    <div className="editor-container">
      <Editor
        username="fooperson"
        docMap={docMap}
        docState={docState}
        documentId={DocID}
      />
      <button
        onClick={() => {
          localStorage.clear()
          window.location.reload()
        }}
      >
        Destroy
      </button>
    </div>
  )
}
