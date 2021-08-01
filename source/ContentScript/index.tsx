import * as React from "react"
import ReactDOM from "react-dom"
import CardWidget from "./CardWidget"

import "./styles.scss"

export {}

// ENTRYPOINT

let pathName = window.location.pathname
// /card/<set>/<id>/[locale]/<name>
let pathNameTest = /\/card\/.*/

if (pathNameTest.test(pathName)) {
	CardPageSetup()
}

async function CardPageSetup() {
	// Prepare HTML for widget
	let mainDiv = document.getElementById("main")
	let container = document.createElement("div")
	container.setAttribute("class", "toolbox scm--container")
	container.setAttribute("id", "scm--collection-mgr")

	let cardData = await GetCardData()

	if (mainDiv) {
		mainDiv.prepend(container)
		ReactDOM.render(
			<CardWidget cardData={cardData} />,
			document.getElementById("scm--collection-mgr")
		)
	} else {
		console.error("Couldn't find #main")
	}
}

async function GetCardData() {
	let cardId = document
		.querySelector("meta[name='scryfall:card:id']")
		?.getAttribute("content")

	let apiUrl = `https://api.scryfall.com/cards/${cardId}?format=json`

	try {
		let res = await fetch(apiUrl, {
			method: "GET",
		})
		return await res.json()
	} catch (err) {
		console.error(err)
	}
}
