const express = require('express');
const jwt = require("jsonwebtoken");
const { expressjwt } = require("express-jwt");
const cardsJSON = require('./cards.json');
const fs = require('fs');
const path = require('path');
const url = require('url');
const PORT = process.env.PORT || 3000;
const app = express();
require('dotenv').config();
app.use(express.json());


const users = [
    {
        userId: "MClairmont",
        password: "Eternal",
        firstName: "Matthew",
        lastName: "Clairmont"
    },
    {
        userId: "DBishop",
        password: "Weaver",
        firstName: "Diana",
        lastName: "Bishop"
    },
    {
        userId: "MWhitmore",
        password: "Kind",
        firstName: "Marcus",
        lastName: "Whitmore"
    }
]

app.get('/', (req, res) => {
    console.log('Welcome');
    res.send('Welcome my friend');
});


app.post('/getToken', (req, res) => {
    const {userId, password} = req.body;
    const user = users.find((currUser) => currUser.userId === userId);

    if (!user || user.password !== password) {
        return res.status(401).json({errorMessage: "Invalid Credentials"});
    }

    const token = jwt.sign({userId: user.userId}, process.env.secret, {
        algorithm: "HS256",
        expiresIn: "10m",
    });

    res.json({token: token});
});

app.get('/cards', (req, res) => {
    const { id, name, set, cardNumber, type, power, toughness, rarity, cost} = req.query;

    let filteredArray = cardsJSON.cards;  
    let parsedId = parseInt(id);
    let parsedCardNumber = parseInt(cardNumber);
    let parsedPower = parseInt(power);
    let parsedToughness = parseInt(toughness);
    let parsedCost = parseInt(cost);

    if (parsedId && !isNaN(parsedId)) {
        filteredArray = filteredArray.filter((card) => card.id === parsedId);
    }

    if (name) {
        filteredArray = filteredArray.filter((card) => card.name === name);
    }

    if (set) {
        filteredArray = filteredArray.filter((card) => card.set === set);
    }

    if (parsedCardNumber && !isNaN(parsedCardNumber)) {
        filteredArray = filteredArray.filter((card) => card.cardNumber === parsedCardNumber);
    }

    if (type) {
        filteredArray = filteredArray.filter((card) => card.type === type);
    }

    if (parsedPower && !isNaN(parsedPower)) {
        filteredArray = filteredArray.filter((card) => card.power === parsedPower);
    }

    if (parsedToughness && !isNaN(parsedToughness)) {
        filteredArray = filteredArray.filter((card) => card.toughness === parsedToughness);
    }

    if (rarity) {
        filteredArray = filteredArray.filter((card) => card.rarity === rarity);
    }

    if (parsedCost && !isNaN(parsedCost)) {
        filteredArray = filteredArray.filter((card) => card.cost === parsedCost);
    }

    //Question: Is it better to have the res be the array or the array inside of an object?
    res.json(filteredArray);
});

app.post('/cards/create', 
    expressjwt({ secret: process.env.secret, algorithms: ["HS256"] }),
    (req, res) => {
        const newCard = req.body;
        const index = cardsJSON.cards.findIndex((card) => card.id === newCard.id);

        if (index >= 0) {
            return res.status(400).json({ errorMessage: "There is already an exsiting card with that id. Select a different id."});
        }
        else {
            cardsJSON.cards.push(newCard);
            res.json({status: "success", message: "Added New Card", newCard});
        }


        fs.writeFile("cards.json", JSON.stringify(cardsJSON, null, 2), (err) => {
            if (err) {
                console.log(err);
                return;
            }
            else {
                console.log("Added New Card to cards.json File")
            }
        });

        console.dir(cardsJSON.cards, {'maxArrayLength': null});
    }
);

app.put('/cards/:id', 
    expressjwt({ secret: process.env.secret, algorithms: ["HS256"] }),
    (req, res) => {
        const {id, name, set, cardNumber, type, power, toughness, rarity, cost} = req.body; 
        let parsedParamId = parseInt(req.params.id);
        let index = cardsJSON.cards.findIndex((card) => card.id === parsedParamId);

        if (index < 0) {
            res.json({errorMessage: "The Id provided cannot be found. Please Enter a number."});
        }
        else {

            if (id && !isNaN(id)) {
    
                let indexNewId = cardsJSON.cards.findIndex((card) => card.id === id);
    
                if (indexNewId >= 0) {
                    return res.status(400).json({ errorMessage: "There is already an exsiting card with that id. Select a different id."});
                }
                else {
                    cardsJSON.cards[index].id = id;
                }
            }
    
            if (name) {
                cardsJSON.cards[index].name = name;
            }
    
            if (set) {
                cardsJSON.cards[index].set = set;
            }
    
            if (cardNumber && !isNaN(cardNumber)) {
                cardsJSON.cards[index].cardNumber = cardNumber;
            }
    
            if (type) {
                cardsJSON.cards[index].type = type;
            }
    
            if (power && !isNaN(power)) {
                cardsJSON.cards[index].power = power;
            }
    
            if (toughness && !isNaN(toughness)) {
                cardsJSON.cards[index].toughness = toughness;
            }
    
            if (rarity) {
                cardsJSON.cards[index].rarity = rarity;
            }
    
            if (cost && !isNaN(cost)) {
                cardsJSON.cards[index].cost = cost;
            }
            
    
            fs.writeFile("cards.json", JSON.stringify(cardsJSON, null, 2), (err) => {
                if (err) {
                    console.log(err);
                    return;
                }
                else {
                    console.log("Added Updated Card to cards.json File")
                }
            });
    
            res.json({message: "Successfully Updated Card", updatedCard: cardsJSON.cards[index]});
        }
    }
);

app.delete('/cards/:id',
    expressjwt({secret: process.env.secret, algorithms: ["HS256"]}),
    (req, res) => {
        let id = parseInt(req.params.id);
        let index = cardsJSON.cards.findIndex((card) => card.id === id);

        if (index >= 0) {
            res.json({message: "Successfully Deleted Card", deletedCard: cardsJSON.cards[index]});
            cardsJSON.cards.splice(index, 1);

            fs.writeFile("cards.json", JSON.stringify(cardsJSON, null, 2), (err) => {
                if (err) {
                    console.log(err);
                    return;
                }
                else {
                    console.log("Deleted Card from cards.json File")
                }
            });
        }
        else {
            res.json({errorMessage: "Could Not Find Requested Card ID."})
        }
    }
);

app.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
        res.status(401).json({errorMessage: "Invalid or Expired token...."});
    }
});

app.listen(PORT, () => {
    console.log("Listening on port 3000...")
});