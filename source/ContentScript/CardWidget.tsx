import * as React from "react"
import { browser } from "webextension-polyfill-ts"
import { Msg } from "../Defs/messages"
// import { browser, Tabs } from "webextension-polyfill-ts"

import "./styles.scss"

// function openWebPage(url: string): Promise<Tabs.Tab> {
// 	return browser.tabs.create({ url })
// }

interface CardWidgetProps {
	cardData: any
}

const CardWidget = (props: CardWidgetProps) => {
	const [cards, setCards] = React.useState([])

	let hasNonFoil = props.cardData.nonfoil
	let hasFoil = props.cardData.foil

	const AddCard = (quantity: number, isFoil: boolean) => {
		let msg: Msg = {
			type: "ADD_CARD",
			payload: {
				name: props.cardData.name,
				lang: props.cardData.lang,
				id: props.cardData.id,
				isFoil: isFoil,
				quantity: quantity,
			},
		}
		browser.runtime.sendMessage(msg)
	}

	const RemoveCard = (quantity: number, isFoil: boolean) => {
		let msg: Msg = {
			type: "REMOVE_CARD",
			payload: {
				id: props.cardData.id,
				isFoil: isFoil,
				quantity: quantity,
			},
		}
		browser.runtime.sendMessage(msg)
	}

	React.useEffect(() => {
		browser.runtime.sendMessage({ type: "COLLECTION_UPDATE", payload: {} })
	}, [])

	browser.runtime.onMessage.addListener((msg) => {
		if (msg.type === "COLLECTION_UPDATE") {
			setCards(msg.payload)
		}
	})

	return (
		<div className="inner-flex">
			<div className="toolbox-column">
				<h6>Collection</h6>
				<ul className="toolbox-links">
					{hasNonFoil ? (
						<li>
							<a className="button-n" onClick={() => AddCard(1, false)}>
								Add Card
							</a>
						</li>
					) : null}
					{hasFoil ? (
						<li>
							<a className="button-n" onClick={() => AddCard(1, true)}>
								Add Card (Foil)
							</a>
						</li>
					) : null}
					{hasNonFoil ? (
						<li>
							<a
								className="button-n"
								onClick={() => RemoveCard(1, false)}
							>
								Remove Card
							</a>
						</li>
					) : null}
					{hasFoil ? (
						<li>
							<a
								className="button-n"
								onClick={() => RemoveCard(1, true)}
							>
								Remove Card (Foil)
							</a>
						</li>
					) : null}
				</ul>
			</div>
			<div className="toolbox-column">
				<h6>Quantity</h6>
				<ul>
					{cards.map((card: any) => (
						<li key={card._id}>
							{card.name} {card.quantityNonFoil} {card.quantityFoil}
						</li>
					))}
				</ul>
			</div>
		</div>
	)
}

export default CardWidget
