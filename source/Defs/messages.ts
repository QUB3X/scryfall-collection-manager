export type MsgType =
	| "ADD_CARD"
	| "REMOVE_CARD"
	| "SET_CARD"
	| "SYNC"
	| "COLLECTION_UPDATE"
export interface Msg {
	type: MsgType
	payload: any
}
