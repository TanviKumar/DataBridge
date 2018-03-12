var express = require('express');
var router = express.Router();
var UserData = require('../models')['user_data'];
var TransactionData = require('../models')['transaction_data'];
var LegitImage = require('../models')['legit_image'];
var UpvoteAndDownvote = require('../models')['upvote_and_downvote'];
let sha1 = require("sha1");
/* GET home page. */
router.get("/", function(req, res) {
	res.json({ title: "Express" });
});

router.post("/users/signup", (req, res) => {
	let username = req.body.username;
	let password = req.body.password;
	if(!username || !password){
		return res.json({no: 'no'});
	}
	if(req.body.public_hash){
		UserData.create({
			username: username,
			password: password,
			public_hash: req.body.public_hash
		})
			.then((user) => {
				return res.json({success:true, code:200, user: user.dataValues});
			})
			.catch(err => {
				return res.json({err:err});
		})	
	}
	UserData.create({
		username: username,
		password: password,
		public_hash: sha1(Math.random()*32423)
	})
		.then(() => {
			return res.json({success:true, code:200});
		})
		.catch(err => {
			return res.json({err:err});
	})
});
router.post("/users/login", (req, res) => {
	let username = req.body.username;
	let password = req.body.password;
	if(!username || !password){
		return res.json({no: 'no'});
	}
	UserData.findOne({
		where: {
			username,
			password
		}
	})
		.then( (user) => {
			if(user){
				req.session.pub_key = user.public_hash;
				return	res.json({yes:'eys'});
			}
			return res.json({yes: 'yes'});
		})
});
router.use(function(req, res, next){
	if(!req.session.pub_key){
		return res.json({success: false, message: "Please log in!"});
	}
	next();
})
router.post("/upvote/:hash", (req, res) => {
	let pubId = req.session.pub_key;
	TransactionData.findOne({
		where:{
			hash_id:  req.params.hash
		}
	})
		.then((dataset)=>{
			if(dataset){
				let upvoters = JSON.parse(dataset.upvoters);
				let downvoters = JSON.parse(dataset.downvoters);
				console.log(upvoters, downvoters);
				if(upvoters.indexOf(pubId) === -1){
					let index = downvoters.indexOf(pubId);
					if(index != -1){
						downvoters.splice(index, 1);
					}
					upvoters.push(pubId);
					TransactionData.update(
					{
						upvoters: JSON.stringify(upvoters),
						downvoters: JSON.stringify(downvoters)
					},
					{
						where: {hash_id: dataset.hash_id}
					}).
						then(success =>{

							 if(success){
							 	res.json({success: true, message: "Upvoted"});
							 }
						})
					 	.catch(err => {res.json({success: false, message: "Failed to update"})})
				}else{
					res.json({success: false, message: "Already upvoted"});
				}

			}	
		})
		.catch(err => {

			console.log(err);
			res.json({err: err});
		})
});

router.post("/downvote/:hash", (req, res) => {
	let pubId = req.session.pub_key;
	TransactionData.findOne({
		where:{
			hash_id:  req.params.hash
		}
	})
		.then((dataset)=>{
			if(dataset){
				let upvoters = JSON.parse(dataset.upvoters);
				let downvoters = JSON.parse(dataset.downvoters);
				if(downvoters.indexOf(pubId) === -1){
					let index = upvoters.indexOf(pubId);
					if(index != -1){
						upvoters.splice(index, 1);
					}
					downvoters.push(pubId);
					dataset.downvoters = JSON.stringify(downvoters);
					dataset.upvoters = JSON.stringify(upvoters);
					TransactionData.update(
					{
						upvoters: JSON.stringify(upvoters),
						downvoters: JSON.stringify(downvoters)
					},
					{
						where: {hash_id: dataset.hash_id}
					}).
						then(success =>{
							if(success){
							 	res.json({success: true, message: "Downvoted!"});
							}
						 })
					 	.catch(err => {res.json({success: false, message: "Failed to update"})})
				}else{
					res.json({success: false, message: "Already upvoted"});
				}

			}	
		})
		.catch(err => {
			console.log(err);
			res.json({err: err});
		})
});
router.post("/create", (req, res) => {
	let pub_key = req.session.pub_key;
	let url = req.body.url;
	if(!pub_key){
		return res.json({success: false});
	}
	UserData.findOne({
		where: {
			public_hash: pub_key
		}
	})
		.then((user) => {
			TransactionData.create({
				hash_id : sha1(Math.random()),
				upvotes: 0,
				downvotes: 0,
				title: 'asd',
				description:'asd',
				upvoters: '[]',
				downvoters: '[]',
				verified: false,
				author: pub_key,
				url
			})
				.then((td) => {
					return res.json({success: true});
				})
				.catch(err => {
					res.json({err: err});
				})
		})
		.catch(err => {
			res.json({err: err});
		})
});
router.get("/")
router.get("/users/getDatasets", (req, res) => {
	TransactionData.findAll({
		attributes: ['upvoters', 'downvoters', 'hash_id', 'verified', 'title', 'description', 'url']
	})
		.then((dataset1) => {
				return res.json({dataset1});
		})
		.catch(err => {
			console.log(err);
			res.json({success: false, message: "Fetch failed!"})
		})
});
router.get("/users/getValidDatasets", (req, res) => {
	TransactionData.findAll({
		attributes: ['upvoters', 'downvoters', 'hash_id', 'verified', 'title', 'description'],
		where: {
			verified: true
		}
	})
		.then((dataset1) => {
				return res.json({dataset1});
		})
		.catch(err => {
			console.log(err);
			res.json({success: false, message: "Fetch failed!"})
		})
});
router.post('/deleteData/:hash_id', (req, res)=>{
	if(!req.params.hash_id){
		return;
	}
	TransactionData.deleteOne({
		where:{
			hash_id: this.params.hash_id
		}
	})
		.then(() => {
			res.json({success: true});
		})
		.catch(err => {
			res.json({success: false});
		})
})
module.exports = router;
