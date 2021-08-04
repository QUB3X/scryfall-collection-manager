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

	let cardId = GetCardId()

	if (mainDiv) {
		mainDiv.prepend(container)
		ReactDOM.render(
			cardId ? (
				<CardWidget cardId={cardId} />
			) : (
				<p>Error: Card Id not found!</p>
			),
			document.getElementById("scm--collection-mgr")
		)
	} else {
		console.error("Couldn't find #main")
	}
}

function GetCardId() {
	let cardId = document
		.querySelector("meta[name='scryfall:card:id']")
		?.getAttribute("content")
	return cardId
}
