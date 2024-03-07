require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const port = 8000;
const app = express();

// Connexion à la base de données
function connect(){
    try{
        mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to the database');
    }
    catch(err){
        console.log(err);
    }
}
connect();

//Schema Person
var personSchema = new mongoose.Schema({
    name: { type: String, required: true },
    age: Number,
    favoriteFoods: [String]
});

//création du modéle
const Person = mongoose.model('Person', personSchema);

//création d'une personne
var person = new Person({
    name: 'Rachid Fall',
    age: 29,
    favoriteFoods: ['Thieboudjeun', 'Dibi']
});

//enregistrement de la personne dans la BD
person
    .save()
    .then(console.log('Personne ajoutée avec succès.'))
    .catch(err => {
        console.error(err)
    })

//création de plusieurs personnes
const arrayOfPeople = [
    { name: 'Fallou Diallo', age: 27, favoriteFoods: ['Riz au poisson', 'Pastel'] },
    { name: 'Malang Ndiaye', age: 30, favoriteFoods: ['Riz au poulet', 'Salade'] },
    { name: 'Babacar Ndir', age: 27, favoriteFoods: ['Salade'] }
];
Person
    .create(arrayOfPeople)
    .then(console.log('Personnes ajoutées avec succès.'))
    .catch(err => {
        console.error(err)
    })

//recherche toutes les personnes
Person
    .find()
    .then(docs => {
        console.log('Personnes trouvées.',docs)
    })
    .catch(err => {
        console.error(err)
    })

//recherche une personne avec le plat préféré "Pastel"
Person
    .findOne({ favoriteFoods: {'$in':'Pastel' }})
    .then(doc => {
        console.log('Personne trouvée.',doc)
    })
    .catch(err => {
        console.error(err)
    })

//recherche une personne par son id
var idUser = '6467a453554258b1b7226124';
Person
    .findById(idUser)
    .then(doc => {
        console.log('Personne trouvée.',doc)
    })
    .catch(err => {
        console.error(err)
    })

//recherche par id puis ajout de plat
var id = '6467a453554258b1b7226124';
Person
    .findById(id)
    .then(doc => {
        doc.favoriteFoods.push('Hamburger')
        doc.save()
        console.log(doc)
    })
    .catch(err => {
        console.error(err)
    })

//recherche par nom et mettre à jour l'âge
Person
    .findOneAndUpdate({name: 'Fallou Diallo'}, { age: 20 },{ new: true })
    .then(doc =>{
        console.log('Age mis à jour:',doc)
    })
    .catch(err => {
        console.error(err)
    })

//supprimer la personne avec l'id "6467a38fa1aea7b38c7f99ed"
var idDel = '6467a38fa1aea7b38c7f99ed'
Person
    .findByIdAndRemove(idDel)
    .then(console.log(`Personne avec l'id ${idDel} a été supprimée.`))
    .catch(err => {
        console.error(err)
    })

//supprimer toute les personnes avec le nom 'Ibra GNING'
Person
    .deleteMany({name:'Babacar Ndir'})
    .then(console.log('Personne avec le nom Babacar Ndir a été supprimée.'))
    .catch(err => {
        console.error(err)
    })

//Trouvez des gens qui aiment la Salade. Triez-les par nom, limitez les résultats à deux documents et masquez leur ancienneté
Person
    .find({ favoriteFoods: {'$in':'Salade'}})
    .sort('name')
    .limit(2)
    .select()
    .then(docs => {
        console.log('Les personnes qui aiment la salade:', docs)
    })
    .catch(err => {
        console.error(err)
    })

//Démarrage du server
app.listen(port,
    () => console.log(`Server is running on port ${port}`)
);