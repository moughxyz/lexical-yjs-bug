import { Observable } from "lib0/observable"
import { Doc } from "yjs"
import * as encoding from "lib0/encoding"
import * as decoding from "lib0/decoding"
import * as syncProtocol from "y-protocols/sync"

function wrapRawYjsMessage(message: Uint8Array, type: number): Uint8Array {
  const encoder = encoding.createEncoder()
  encoding.writeVarUint(encoder, type)
  encoding.writeVarUint8Array(encoder, message)
  return encoding.toUint8Array(encoder)
}

export class DocState extends Observable<string> {
  public readonly doc: Doc

  constructor(readonly callback: (update: Uint8Array) => void) {
    super()
    this.doc = new Doc()
    this.doc.on("update", this.handleDocBeingUpdatedByLexical)
  }

  destroy(): void {
    this.doc.off("update", this.handleDocBeingUpdatedByLexical)
  }

  public getDoc(): Doc {
    return this.doc
  }

  public receiveUpdate(update: Uint8Array): void {
    this.handleRawSyncMessage(update)
  }

  handleDocBeingUpdatedByLexical = (update: Uint8Array, origin: any) => {
    const isNonUserInitiatedChange = origin === this
    if (isNonUserInitiatedChange) {
      return
    }

    this.callback(update)
  }

  private handleRawSyncMessage(update: Uint8Array, origin?: any): void {
    const unusedReply = encoding.createEncoder()
    encoding.writeVarUint(unusedReply, 0)

    const decoder = decoding.createDecoder(
      wrapRawYjsMessage(update, syncProtocol.messageYjsUpdate)
    )
    syncProtocol.readSyncMessage(decoder, unusedReply, this.doc, origin ?? this)
  }
}
