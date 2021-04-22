/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';
const mongoose = require('mongoose');

mongoose.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true });

const BOOK_SCHEMA = new mongoose.Schema({
  title: {type: String, required: true},
  comments: [String],
  commentcount: {type: Number, default: 0}
});

const LIBRARY = mongoose.model('Library', BOOK_SCHEMA);

module.exports = function (app) {

  app.route('/api/books')
    //response will be array of book objects
    //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
    .get(function (req, res){
      LIBRARY.find({}, (err, books) => {
        if(err) return console.log(err);
        console.log('response shows all books');
        res.json(books);
      });
    })
    //response will contain new book object including atleast _id and title
    .post(function (req, res){
      if(!req.body.title) return res.send('missing required field title');      

      const data = new LIBRARY(req.body);
      data.save((err, book) => {
        if(err) return console.log(err);
        console.log({_id: book._id, title: book.title});
        res.json({_id: book._id, title: book.title});
      });
    })
    //if successful response will be 'complete delete successful'
    .delete(function(req, res){
      LIBRARY.deleteMany({}, (err, result) => {
        if(err) return console.log(err);
        console.log('complete delete successful');
        res.json('complete delete successful');
      });
    });

  app.route('/api/books/:id')
    //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    .get(function (req, res){
      LIBRARY.findById(req.params.id, (err, book) => {
        if(err) return console.log(err);
        if(!book) {
          console.log('no book exists');
          return res.send('no book exists');
        }
        console.log(book);
        res.json(book);
      });
    })
    //json res format same as .get
    .post(function(req, res){
      if(!req.params.id) return res.send('missing required field title');
      if(!req.body.comment) return res.send('missing required field comment');

      LIBRARY.findByIdAndUpdate(req.params.id, {$push: {comments: req.body.comment}, $inc: {commentcount: 1}}, {new: true}, (err, book) => {
        if(err) return console.log(err);
        if(!book) {
          console.log('no book exists');
          return res.send('no book exists');
        }
        console.log(book);
        res.json(book);
      });
    })
    //if successful response will be 'delete successful'
    .delete(function(req, res){
      LIBRARY.findByIdAndDelete(req.params.id, (err, result) => {
        if(err) return console.log(err);
        if(!result) {
          console.log('no book exists');
          return res.send('no book exists');
        }
        console.log('delete successful');
        res.send('delete successful');
      });
    });
  
};
