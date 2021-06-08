import React from "react";
import { useState, useEffect } from "react";
import Card from "./Card";
import Hand from "./Hand";
import PlayedCard from "./PlayedCard";
import { socket } from "../connection/socket";

export const GameStage = ({ match }) => {
	//Get querystring for room
	const roomCode = match.params.roomCode;

	//Initiate game state
	const [playerId, setPlayerId] = useState("");
	const [room, setRoom] = useState("");
	const [error, setError] = useState(false);
	const [gameOver, setGameOver] = useState(false);
	const [cardsPlayed, setCardsPlayed] = useState([]);
	const [allCards, setAllCards] = useState([]);
	const [level, setLevel] = useState(3);
	const [playerState, setPlayerState] = useState([]);
	const [username, setUsername] = useState("Patrick");

	//Run check on gameOver state on any state change
	useEffect(() => {
		//Join room and send your information to other players
		if (localStorage.getItem("ifVisited") !== match.params.roomCode) {
			socket.emit("joinRoom", { username, room: match.params.roomCode });
		}
		//Recieve information for players in the room
		socket.on("initGameState", (payload) => {
			setPlayerState(payload.players);
			setPlayerId(payload.player);
			setRoom(payload.room);
			localStorage.setItem("ifVisisted", match.params.roomCode);
		});
	}, []);

	//GAME LOGIC FUNCTIONS

	useEffect(() => {
		//Check for game over - Should also emit updatedState to all users if true
		checkGameOver();
	}, [cardsPlayed, allCards]);

	//Generator cards to be dealt
	const numberGenerator = () => {
		return Math.floor(Math.random() * 100 + 1);
	};

	//Deal cards to player
	const deal = () => {
		const players = playerState;
		const allCardsDealt = [];
		for (let i = 0; i < 3; i++) {
			for (let j = 0; j < players.length; j++) {
				const dealCard = () => {
					let value = numberGenerator();
					let checkCard = allCardsDealt.every((card) => card !== value);
					if (checkCard) {
						players[j].cards.push(value);
						allCardsDealt.push(value);
					} else {
						dealCard();
						return;
					}
				};
				dealCard();
			}
		}
		setPlayerState(players);
		setAllCards(allCardsDealt);
	};

	//Play cards
	const playCard = (value, player) => {
		const playerWithCard = playerState.filter((item) => item.id === player)[0];
		const updatedPlayerState = {
			id: playerWithCard.id,
			cards: playerWithCard.cards.filter((card) => card !== value),
		};
		setCardsPlayed([...cardsPlayed, value]);
		setPlayerState(
			playerState.map((item) =>
				item.id === updatedPlayerState.id ? updatedPlayerState : item
			)
		);
	};

	//Check whether game has ended
	const checkGameOver = () => {
		const sortedAllCards = allCards
			.sort((a, b) => a - b)
			.slice(0, cardsPlayed.length);
		if (sortedAllCards.toString() !== cardsPlayed.toString()) {
			setGameOver(true);
		}
	};

	return (
		<>
			<button
				onClick={() => {
					deal();
				}}
			>
				Deal
			</button>
			{!gameOver ? (
				<div className='gameStage'>
					{cardsPlayed.map((card, index) => (
						<PlayedCard value={card} key={index} />
					))}
				</div>
			) : (
				<h1>GAME OVER</h1>
			)}

			<div>
				{playerState.map((player, index) => (
					<Hand key={index}>
						<p>{`Player: ${player.id}`}</p>
						{player.cards.map((card, index) => (
							<Card
								value={card}
								player={player.id}
								key={index}
								playCard={playCard}
							/>
						))}
					</Hand>
				))}
			</div>
		</>
	);
};

export default GameStage;
