import React from 'react'

// renders card received from deck
function Card({name, image}) {
    return <img 
        className = 'Card'
        alt = {name}
        src = {image}
    />
}

export default Card;