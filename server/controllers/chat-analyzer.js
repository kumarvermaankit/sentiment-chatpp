
const Message = require("../models/message");
const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const Chat = require("../models/chat");
const sendMail = require("./sendMail");


const analyzeChats = asyncHandler(async (req, res) => {

   var  TotalChats = 0;
    var joys = [];
    var sorrows = [];
    var calms = [];
    var excitements = [];
    try {
      var allChats = await Chat.find({
        users: { $elemMatch: { $eq: req.user._id } },
      })
        .populate("users", "-password")
        .populate("groupAdmin", "-password")
        .populate("latestMessage")
        .sort({ updatedAt: -1 });
  
      allChats = await User.populate(allChats, {
        path: "latestMessage.sender",
        select: "name pic email",
      });
  

    const requests =  allChats.map(async (chat) => {
        try {
            
            const allMessages = await Message.find({ chatId:chat._id })
              .populate("sender", "name image email")
              .populate("chatId");


            
              
            var joy = 0;
            var sorrow = 0;
            var calm = 0;
            var excitement = 0;
            const request2 = allMessages.map((message) => {
                TotalChats += 1;
                console.log("emotion",message.emotion)
                if( message.emotion == "joy" || message.emotion == "love" ||  message.emotion == "trust" ){
                    joy += 1;
                }
                if( message.emotion == "fear" || message.emotion == "sadness" || message.emotion == "shame" || message.emotion == "guilt" || message.emotion == "disgust" ){
                    sorrow += 1;

                }
                if(message.emotion == "calm" || message.emotion == "neutral" ){
                    calm += 1;
                }
                
                if(message.emotion == "anger" || message.emotion == "surprise" ){
                    excitement += 1;
                }

            })

            Promise.all(request2).then(() => {
              joys.push(joy);
              sorrows.push(sorrow);
              calms.push(calm);
              excitements.push(excitement);
            })
            
          } catch (err) {
            console.log(err);
            res.status(400);
            throw new Error("Server could not process request");
          }
      })

     
      Promise.all(requests).then(() => {
        console.log("TotalChats",TotalChats)
        
        console.log("joys",joys)
        
        console.log("sorrows",sorrows)
        console.log("calms",calms)
        console.log("excitements",excitements)
       var vitalities = [];
        for(var i = 0; i < joys.length; i++){
          if(joys[i]+sorrows[i] == 0){
            var vivacity = 0;
          }
          else{
            var vivacity = joys[i]/(joys[i]+sorrows[i])
          }

          if(calms[i]+excitements[i] == 0){
            var relaxation = 0;
          }
          else{
            var relaxation = calms[i]/(calms[i]+excitements[i])
          }
          console.log("vivacity",vivacity)
          console.log("relaxation",relaxation)
          vitalities.push(0.60*vivacity+0.40*relaxation)
        }

        const sum_vitalities = vitalities.reduce((a, b) => a + b, 0);
        // console.log("sum_vitalities",sum_vitalities)
        const mean_vitalities = (sum_vitalities / vitalities.length) || 0;
        // console.log("mean_vitalities",mean_vitalities)
        //standard deviation of vitalities
        // var sum = 0;
        // for(var i = 0; i < vitalities.length; i++){
        //   sum += Math.pow((vitalities[i]-mean_vitalities),2);
        
        // }

        // var standard_deviation = Math.sqrt(sum/vitalities.length);
        var sum_sorrow = sorrows.reduce((a, b) => a + b, 0);
        var val = Math.round(sum_sorrow/TotalChats * 100);
        // var mental_activity = 0.75*mean_vitalities+0.25*standard_deviation
        // console.log("mental_activity",mental_activity)
        // console.log("val",val)
        
       res.json(val);



       if(val > 50){
          User.findById(req.user._id).then((user) => {
              sendMail(user.concerned_person)
          })
        
       }
      })
      

      // console.log("allchats",allChats)
  
    //   res.status(200).send(allChats);
    } catch (err) {
      res.status(500);
      throw new Error("Server could not work on the request");
    }


   



  });

module.exports = { analyzeChats };