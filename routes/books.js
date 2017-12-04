'use strict';

const express = require('express');
const knex= require('../knex');
// eslint-disable-next-line new-cap
const router = express.Router();

// YOUR CODE HERE
router.get('/books',(req,res,next)=>{
  return knex('books')
  .select('id','title','author','genre','description','cover_url AS coverUrl','created_at AS createdAt','updated_at AS updatedAt')
  .orderBy('title','ASC')
  .then(function(books){
    res.send(books)
  })
  .catch(function(err){
    next(err)
  });
});

router.get('/books/:id',(req,res,next)=>{
  let id = req.params.id;
  return knex('books')
  .select('id','title','author','genre','description','cover_url AS coverUrl','created_at AS createdAt','updated_at AS updatedAt').first()
  .where('id',id)
  .then(function(search_item){
    if(!search_item){
      return next(err)
    }
    res.send(search_item)
  })
  .catch(function(err){
    next(err)
  });
});

router.post('/books',(req,res,next)=>{
  return knex('books')
  .insert({
    title : req.body.title,
    author : req.body.author,
    genre : req.body.genre,
    description : req.body.description,
    cover_url : req.body.coverUrl
  }, '*')
  .then(function(book){
    let newBook ={
      id : book[0].id,
      title : book[0].title,
      author : book[0].author,
      genre : book[0].genre,
      description :book[0].description,
      coverUrl : book[0].cover_url
    }
    res.send(newBook);
  })
  .catch(function(err){
    next(err);
  })
})

router.patch('/books/:id',(req,res,next)=>{
  let id = req.params.id
  return knex('books')
  .where('id',id)
  .then(function(book){
    if(!book){
      return next(err);
    }
    return knex('books')
    .update({
      title : req.body.title,
      author : req.body.author,
      genre : req.body.genre,
      description : req.body.description,
      cover_url : req.body.coverUrl
    },'*')
    .where('id',id)
  })
  .then(function(item){
    let newBook ={
      id : item[0].id,
      title : item[0].title,
      author : item[0].author,
      genre : item[0].genre,
      description :item[0].description,
      coverUrl : item[0].cover_url
    }
    res.send(newBook)
  })
  .catch(function(err){
    next(err)
  })
})

router.delete('/books/:id',(req,res,next)=>{
  let book
  let id = req.params.id
  knex('books')
  .where('id',id).first()
  .then(function(item){
    if(!item){
      return next()
    }
    book = item;

    return knex('books')
    .del()
    .where('id',id)
  })
  .then(function(){
    delete book.id
    let newBook ={
      title : book.title,
      author : book.author,
      genre : book.genre,
      description :book.description,
      coverUrl : book.cover_url
    }
    res.send(newBook)
  })
  .catch(function(err){
    next(err);
  })
})
module.exports = router;
