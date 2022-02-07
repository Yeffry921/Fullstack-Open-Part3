// Connect to DB
const mongoose = require('mongoose')

if(process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url = `mongodb+srv://yeffry921:Naruto921@phones.a7zze.mongodb.net/Phonebook?retryWrites=true&w=majority`

mongoose.connect(url)

// Set up Schema
const phoneSchema = new mongoose.Schema({
  id: Number,
  name: String,
  number: Number,
})

const Phone = mongoose.model('Phone', phoneSchema)

// Save data to DB

const phone = new Phone({
  name: name,
  number: number,
})

if(!name & !number) {
  Phone
    .find({})
    .then((result) => {
      result.forEach((phone) => {
      console.log(phone)
      })
      mongoose.connection.close()
    })
}

phone.save().then((result) => {
  console.log(console.log(`added ${result.name} number ${result.number} to phonebook`))
})
