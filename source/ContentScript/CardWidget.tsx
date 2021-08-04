import React, { useState, useEffect } from "react"
import Scry from "scryfall-client"
import Card from "scryfall-client/dist/models/card"
import { Card as CardEntry } from "../Background/index"
import { browser } from "webextension-polyfill-ts"
import { Msg } from "../Defs/messages"
import "./styles.scss"

interface CardWidgetProps {
	cardId: string
}

const CardWidget = (props: CardWidgetProps) => {
	const [cards, setCards]: [CardEntry[], any] = useState([])
	const [cardInfo, setCardInfo]: [Card | null, any] = useState(null)

	// Execute once
	useEffect(() => {
		// Load card data
		Scry.getCard(props.cardId, "id")
			.then((card) => setCardInfo(card))
			.catch(() => setCardInfo(null))

		// Request collection
		browser.runtime.sendMessage({ type: "COLLECTION_UPDATE", payload: {} })

		// Register listener
		browser.runtime.onMessage.addListener((msg) => {
			if (msg.type === "COLLECTION_UPDATE") {
				setCards(msg.payload)
			}
		})
	}, [])

	const cardDetails = cards.find((card) => card._id === props.cardId)

	if (!cardInfo)
		return (
			<div className="inner-flex">
				<p>Loading...</p>
			</div>
		)
	return (
		<div className="inner-flex">
			<div className="toolbox-column">
				<h6>Collection</h6>
				<ul className="toolbox-links">
					<AddButton card={cardInfo} />
					<RemoveButton card={cardInfo} />
				</ul>
			</div>
			<div className="toolbox-column">
				<h6>Details</h6>
				<CardQuantityField
					card={cardInfo}
					label="Non Foil"
					isFoil={false}
					quantity={cardDetails?.quantityNonFoil || 0}
				/>
				<CardQuantityField
					card={cardInfo}
					label="Foil"
					isFoil={true}
					quantity={cardDetails?.quantityFoil || 0}
				/>
			</div>
			<div className="toolbox-column">
				<h6>Quantity</h6>
				<ul>
					{cards.map((card: CardEntry) => (
						<li key={card._id}>
							{card.name} {card.quantityNonFoil} {card.quantityFoil}
						</li>
					))}
				</ul>
			</div>
		</div>
	)
}

interface CardQuantityFieldProps {
	card: Card
	isFoil: boolean
	label: string
	quantity: number
	callback?: (value: number) => void
}

const CardQuantityField = (props: CardQuantityFieldProps) => {
	const _handleChange = (inputElem: any) => {
		if (inputElem.value) {
			let newValue = parseInt(inputElem.value)
			SetCardQuantity(props.card, newValue, props.isFoil)
		}
	}

	const SetCardQuantity = (card: Card, quantity: number, isFoil: boolean) => {
		let msg: Msg = {
			type: "SET_CARD",
			payload: {
				id: card.id,
				isFoil: isFoil,
				quantity: quantity,
			},
		}
		browser.runtime.sendMessage(msg)
	}

	return (
		<label>
			{props.label}
			<input
				type="text"
				pattern="[0-9]*"
				value={props.quantity}
				onChange={_handleChange}
			/>
		</label>
	)
}
interface CardButtonProps {
	card: Card
}

const AddButton = (props: CardButtonProps) => {
	const AddCard = (card: Card, quantity: number, isFoil: boolean) => {
		let msg: Msg = {
			type: "ADD_CARD",
			payload: {
				name: card.name,
				lang: card.lang,
				id: card.id,
				isFoil: isFoil,
				quantity: quantity,
			},
		}
		browser.runtime.sendMessage(msg)
	}

	return (
		<>
			{props.card.nonfoil ? (
				<li>
					<a
						className="button-n"
						onClick={() => AddCard(props.card, 1, false)}
					>
						Add Card
					</a>
				</li>
			) : null}
			{props.card.foil ? (
				<li>
					<a
						className="button-n"
						onClick={() => AddCard(props.card, 1, true)}
					>
						Add Card (Foil)
					</a>
				</li>
			) : null}
		</>
	)
}

const RemoveButton = (props: CardButtonProps) => {
	const RemoveCard = (card: Card, quantity: number, isFoil: boolean) => {
		let msg: Msg = {
			type: "REMOVE_CARD",
			payload: {
				id: card.id,
				isFoil: isFoil,
				quantity: quantity,
			},
		}
		browser.runtime.sendMessage(msg)
	}

	return (
		<>
			{props.card.nonfoil ? (
				<li>
					<a
						className="button-n"
						onClick={() => RemoveCard(props.card, 1, false)}
					>
						Remove Card
					</a>
				</li>
			) : null}
			{props.card.foil ? (
				<li>
					<a
						className="button-n"
						onClick={() => RemoveCard(props.card, 1, true)}
					>
						Remove Card (Foil)
					</a>
				</li>
			) : null}
		</>
	)
}

export default CardWidget
