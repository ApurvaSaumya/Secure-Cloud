var mongoose = require("mongoose");


var fraudSchema = new mongoose.Schema({

	name:{type:String,default:'fr'},
	words:[String]

});

module.exports = mongoose.model("Fraud",fraudSchema);



/*db.frauds.insertOne({name:"fr",words:["money", "online", "quick", "easy", "gamble", "gambling", "rich", "simple", "million", "millions", "billion", "billions", "trusted","100", "1000", "game", "games", "lottery", "charity", "donate", "now", "today", "casino","slot", "slots", "jackpot", "earn", "click", "link", "fast", "tutorial", "per", "hour", "month", "legal", "illegal", "minutes", "verify", "verified", "verification", "facebook", "youtube", "free", "trial","fantasy", "sport", "gift", "gifts", "reward", "rewards", "credit", "INR", "promocode", "cashback", "sell", "tricks", "trading", "bitcoin", "dollars", "ads", "richest", "keep", "reading", "learn", "promote", "URL", "shortener", "views", "quick", "cash"]})






money online quick easy gamble gambling rich simple million millions billion billions trusted
100 1000 game games lottery charity donate now today casino slot slots jackpot earn click link fast 
tutorial per hour month legal illegal minutes verify verified verification facebook youtube free trial
fantasy sport gift gifts reward rewards credit INR promocode cashback sell tricks trading 
bitcoin dollars ads richest keep reading learn promote URL shortener views quick cash

*/