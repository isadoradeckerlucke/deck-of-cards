import React, { useEffect, useState, useRef } from 'react';
import Card from './Card';
import axios from 'axios';
import './Deck.css';

const BASE_URL = "http://deckofcardsapi.com/api/deck";

function Deck(){
    // initial value of deck is null 
    const [deck, setDeck] = useState(null);
    const [drawn, setDrawn] = useState([]);
    const [autoDraw, setAutoDraw] = useState(false);
    // initial value of timer ref is null
    const timerRef = useRef(null);

    // load deck from the API into state 
    useEffect(() => {
        // draw a card from the API, add it to the state drawn list
        async function getData(){
            let d = await axios.get(`${BASE_URL}/new/shuffle`);
            setDeck(d.data)
        }
        getData();
    }, [setDeck])

    useEffect(() => {
        // draw a card and add it to the drawn state list
        async function getCard() {
            let {deck_id} = deck;

            try {
                let drawRes = await axios.get(`${BASE_URL}/${deck_id}/draw/`);
                // if there are no more cards, stop auto drawing and throw an error. 
                if (drawRes.data.remaining === 0) {
                    setAutoDraw(false)
                    throw new Error('no more cards remain')
                }

                // add the card drawn to the drawn list 
                const card = drawRes.data.cards[0];
                setDrawn(d => [
                    ...d,
                    {
                        id: card.code,
                        name: card.suit + " " + card.value, 
                        image: card.image
                    }
                ])
            } catch(err) {
                alert(err)
            }
        }

        // if auto draw is on and the timerRef hasn't been started, draw a new card every second
        if (autoDraw && !timerRef.current) {
            timerRef.current = setInterval(async() => {
                await getCard();
            }, 1000)
        }

        return () => {
            clearInterval(timerRef.current);
            timerRef.current = null;
        } 
        // end of use effect statement, below is array of values passed in as second arg. 
        // useEffect executes callback arrow function above only when the dependencies (array below) have changed between renderings. 
        // all these above things happen when the API call is made and component renders. the first use effect runs once when the API call is finished, sets the state, and then renders the component again.
        // this way we get only one deck, then autoDraw occurs and it doesn't get a new deck unless you change the deck or autodraw value. 
    }, [autoDraw, setAutoDraw, deck])

    // function to toggle autoDraw value true to false
    const toggleAutoDraw = () => {
        setAutoDraw(auto => !auto);
    }

    // map out the cards that have already been drawn.
    const cards = drawn.map(c => (
        <Card key = {c.id} name = {c.name} image = {c.image} />
    ))

    return (
        <div className = 'deck'>
            {deck ? (
                // if there is a deck, create a button that says either stop or keep drawing for me depending on whether you're already auto drawing for them. it toggles auto draw. 
                <button className = 'Deck-gimme' onClick = {toggleAutoDraw}>
                    {autoDraw ? 'stop' : 'start'} drawing cards for me
                </button>
            ) : null}
            <div className = 'Deck-cardarea'>{cards}</div>
        </div>
    )

}

export default Deck;