import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin"
import { ContentEditable } from "@lexical/react/LexicalContentEditable"
import { useMemo } from "react"
import { Provider } from "@lexical/yjs"
import { CollaborationContext } from "@lexical/react/LexicalCollaborationContext"
import {
  InitialConfigType,
  LexicalComposer,
} from "@lexical/react/LexicalComposer"
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary"
import { YDocMap } from "./YDocMap"
import { DocState } from "./DocState"
import { Awareness } from "y-protocols/awareness"
import { CollaborationPlugin } from "@lexical/react/LexicalCollaborationPlugin"

type Props = {
  docMap: YDocMap
  docState: DocState
  documentId: string
  username: string
}

function BuildInitialEditorConfig(
  initialState: string | null
): InitialConfigType {
  return {
    editable: true,
    editorState: initialState,
    namespace: "editor",
    nodes: [],
    onError: (e: Error) => console.error(e),
  }
}

export function Editor({ docMap, docState, documentId, username }: Props) {
  const yjsWebsockProvider = useMemo(() => {
    const baseProvider = (): Provider => {
      return {
        awareness: new Awareness(docMap.get(documentId)!),
        doc: docMap.get(documentId)!,
        connect: () => {},
        disconnect: () => {},
        on: () => {},
        off: () => {},
      } as unknown as Provider
    }

    return baseProvider
  }, [docState])

  const color = useMemo(() => {
    return "black"
  }, [username])

  return (
    <CollaborationContext.Provider
      value={{
        yjsDocMap: docMap,
        name: username,
        color,
        clientID: 0,
        isCollabActive: false,
      }}
    >
      <LexicalComposer initialConfig={BuildInitialEditorConfig(null)}>
        <div className="editor-inner">
          <RichTextPlugin
            ErrorBoundary={LexicalErrorBoundary}
            contentEditable={
              <div className="relative overflow-auto">
                <ContentEditable className="editor-input" />
              </div>
            }
            placeholder={null}
          />
          <CollaborationPlugin
            id={documentId}
            providerFactory={yjsWebsockProvider!}
            shouldBootstrap={false}
          />
        </div>
      </LexicalComposer>
    </CollaborationContext.Provider>
  )
}
