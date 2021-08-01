import { Msg } from "../Defs/messages"
import { browser } from "webextension-polyfill-ts"
import PouchDB from "pouchdb"

const collectionName = "collection0"

// const DB_USER = "admin"
// const DB_PASSWORD = "AWP2jfEvd5o9tTbPEs"
// const DB_URL = "localhost:5984"

// const db = new PouchDB(
// 	`http://${DB_USER}:${DB_PASSWORD}@${DB_URL}/mtg-collection`
// )
const db = new PouchDB("mtg-collection", { auto_compaction: true })

db.info().then((val) => console.log(val))

browser.runtime.onMessage.addListener(async (msg: Msg) => {
	switch (msg.type) {
		case "ADD_CARD":
			console.log("Adding card...", msg.payload)
			AddCard(msg.payload)
			break
		case "SET_CARD":
			console.log("Setting card...")
			break
		case "REMOVE_CARD":
			console.log("Removing card...")
			break
		case "SYNC":
			console.log("Syncing collection...")
			break
		case "COLLECTION_UPDATE":
			console.log("Updating collection...")
			UpdateCollection()
			break
		default:
			break
	}
})

export {}

interface Card {
	name: string
	_id: string
	lang: string
	quantityNonFoil: string
	quantityFoil: string
}

interface Query {
	_id: string
	_rev?: string
	name: string
	cards: Card[]
}

async function AddCard(data: any) {
	var query: Query
	try {
		query = await db.get(collectionName)
	} catch (error) {
		console.error(error)
		query = {
			_id: collectionName,
			name: collectionName,
			cards: [],
		}
	}
	let idx = query.cards.findIndex((card) => card._id == data.id)
	if (idx >= 0) {
		if (data.isFoil) {
			query.cards[idx].quantityFoil += data.quantity
		} else {
			query.cards[idx].quantityNonFoil += data.quantity
		}
	} else {
		query.cards.push({
			_id: data.id,
			name: data.name,
			lang: data.lang,
			quantityFoil: data.isFoil ? data.quantity : 0,
			quantityNonFoil: !data.isFoil ? data.quantity : 0,
		})
	}
	await db.put(query)
	UpdateCollection()
}

async function UpdateCollection() {
	let cards = await GetCards()
	let msg: Msg = {
		type: "COLLECTION_UPDATE",
		payload: cards,
	}
	browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
		browser.tabs.sendMessage(tabs[0].id!, msg)
	})
}

async function GetCards(): Promise<Card[]> {
	var query: Query
	try {
		query = await db.get(collectionName)
		return query.cards
	} catch (error) {
		console.error(error)

		return []
	}
}
