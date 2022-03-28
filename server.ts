import express from 'express';
import ejs from 'ejs';
import {Schema, model, connect} from 'mongoose';
const mongoose = require('mongoose');
const app = express();
app.set('view engine', 'ejs');
mongoose.connect('mongodb+srv://admin:password1234@cluster0.gj8tf.mongodb.net/MapData?retryWrites=true&w=majority');

interface regionInterface{
    name: String;
    capital: String;
    leader: String;
}

const regionSchema = new Schema<regionInterface>({
    name: {type: String, required: true},
    capital: {type: String, reqruied: true},
    leader: {type: String, required: true}
})

const region = model<regionInterface>('region', regionSchema);

app.get('/', (req, res) => {
    region.find({}, function(err, regions){
        res.render('index', {
            regions: regions
        })
    })
})

app.get('/add', function (req, res) {
    const newRegion = new region({
        name: "New Test",
        capital: "New Test",
        leader: "New Test"
    })
    newRegion.save();
  });

app.listen(process.env.PORT || 4000, function() {
    console.log('server running');
})

