const express = require('express');
const admin = require('firebase-admin');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

// 🔑 Optional Firebase Init (For real-time reporting block if you still want it)
const serviceAccount = {
  "type": "service_account",
  "project_id": process.env.FIREBASE_PROJECT_ID || "truecaller-clone-74794",
  "private_key_id": process.env.FIREBASE_PRIVATE_KEY_ID,
  "private_key": process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : undefined,
  "client_email": process.env.FIREBASE_CLIENT_EMAIL
};

if (process.env.FIREBASE_PRIVATE_KEY) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: "https://truecaller-clone-74794-default-rtdb.firebaseio.com/"
    });
}
const db = admin.apps.length ? admin.database() : null;

// 📂 EMBEDDED REAL CONTACTS DATA (Directly Loaded from your JSON File)
const embeddedContacts = [
  { "name": "Boi Balance Harshi", "value": "09015135135" },
  { "name": "Indane Raju", "value": "9794424746" },
  { "name": "Gas Booking", "value": "8726024365" },
  { "name": "Mahima Battery", "value": "+918052958920" },
  { "name": "Rajat", "value": "+918181885756" },
  { "name": "Jialal Bhatta", "value": "+917309438038" },
  { "name": "Rahul Ita", "value": "9453575817" },
  { "name": "Ravi Kumar Jio", "value": "+918920754466" },
  { "name": "Rishabh Pal 2", "value": "8505934441" },
  { "name": "Carpenter", "value": "8726796528" },
  { "name": "Dr Sb Singh", "value": "9839374394" },
  { "name": "Noida", "value": "+919205279979" },
  { "name": "Papa", "value": "7042371247" },
  { "name": "Ramhyt", "value": "+917236983823" },
  { "name": "Indusind Bank", "value": "+912244066666" },
  { "name": "Tiffin Mandhana", "value": "8756860878" },
  { "name": "Pmkvy", "value": "9839194089" },
  { "name": "Jija Ram Nagar", "value": "9453001439" },
  { "name": "Photo", "value": "8400321330" },
  { "name": "Neeraj Pal", "value": "+916387128246" },
  { "name": "Mahima Battery 2", "value": "+919956090154" },
  { "name": "Nitin Verma", "value": "6395786697" },
  { "name": "pramod kumar", "value": "8130913564" },
  { "name": "Pandit Ji", "value": "8400660977" },
  { "name": "Bade Mummy", "value": "+919795178265" },
  { "name": "Pankaj Gupta Ji", "value": "9889155330" },
  { "name": "Jitendra", "value": "7390971799" },
  { "name": "Bade Mami", "value": "+919628130204" },
  { "name": "Job Hunt", "value": "7081107037" },
  { "name": "Prilika Job", "value": "+918999369783" },
  { "name": "Luck Mami", "value": "+918545045342" },
  { "name": "Ranu Building Wale", "value": "7525041220" },
  { "name": "Ravi Painter", "value": "+918896718495" },
  { "name": "Pramod Hotel", "value": "8130913564" },
  { "name": "Raju Bhaiya", "value": "+918953558862" },
  { "name": "Tinku Kumar", "value": "+917906332556" },
  { "name": "Pune", "value": "+919042515253" },
  { "name": "Geeta Mami", "value": "7800831367" },
  { "name": "Sengar Gas", "value": "8795661710" },
  { "name": "Raunak Mathur", "value": "8354026017" },
  { "name": "Pankaj Bhaiya", "value": "8175999992" },
  { "name": "Sister Nawabganj", "value": "+918115323640" },
  { "name": "Pulkit Jain", "value": "9695310975" },
  { "name": "Nitin Vaishnvi Telecom", "value": "9026779041" },
  { "name": "Neeche Wale Uncle", "value": "+919889186187" },
  { "name": "Pramod", "value": "8933892234" },
  { "name": "Bari Mummy Shani", "value": "+919721028085" },
  { "name": "Buaa Ramnagar", "value": "+919651529197" },
  { "name": "Rajol", "value": "+919140759297" },
  { "name": "Tinnu Mishra", "value": "+919450352661" },
  { "name": "Chacha", "value": "9918925115" },
  { "name": "Neeche Wali Auntie", "value": "+916386450076" },
  { "name": "Fool Wale Bhaiya 🌸🌸", "value": "8574544075" },
  { "name": "Nitesh Chaurasia", "value": "+918009847766" },
  { "name": "Nishant2", "value": "+916394757283" },
  { "name": "Shiva", "value": "8957695577" },
  { "name": "Shyam 2", "value": "7310074948" },
  { "name": "Suresh Sir", "value": "+919559509919" },
  { "name": "Shubh Mishra", "value": "+919129860665" },
  { "name": "Suresh Satring", "value": "9554264956" },
  { "name": "Sukhdev Almirah", "value": "+918052959516" },
  { "name": "Suresh Bajpai", "value": "09956226550" },
  { "name": "Shivakant Sir", "value": "7388486438" },
  { "name": "Surjeet", "value": "+919565578334" },
  { "name": "Shivam", "value": "8299780093" },
  { "name": "Sintoo Govind", "value": "7523009060" },
  { "name": "Sunil Sir", "value": "9936484250" },
  { "name": "Suresh", "value": "9919483410" },
  { "name": "Vishal", "value": "9264945279" },
  { "name": "Shyamu Plumber", "value": "7275408005" },
  { "name": "Sundeep Jns", "value": "+918882318109" },
  { "name": "Sohan", "value": "6377761247" },
  { "name": "Shivam", "value": "7310153084" },
  { "name": "Siku", "value": "9616936451" },
  { "name": "Shyam", "value": "9935356596" },
  { "name": "Banti", "value": "9455011300" },
  { "name": "Shayamu", "value": "9795684938" },
  { "name": "Abhinav Dwivedi", "value": "+919453867682" },
  { "name": "Shanu Didi", "value": "6305763795" },
  { "name": "Avi Pandey", "value": "+917678911109" },
  { "name": "Sing Dil Se", "value": "8800221124" },
  { "name": "Guddu2", "value": "7905899957" },
  { "name": "Mama", "value": "9919311099" },
  { "name": "Cyber Security", "value": "+918541016060" },
  { "name": "Harshi", "value": "7068028610" },
  { "name": "Shree Hans", "value": "7991262620" },
  { "name": "Microsoft RISE", "value": "+919115060319" },
  { "name": "Sharma", "value": "8740870567" },
  { "name": "Tiwari", "value": "9936160260" },
  { "name": "Saurabh Jaiswal", "value": "9005260319" },
  { "name": "Ritesh Home", "value": "8423501872" },
  { "name": "Vivek Saxena", "value": "8756008895" },
  { "name": "Rashmi Mam", "value": "+919936775358" },
  { "name": "Lucknow Pappu Bhaiya", "value": "+918545045342" },
  { "name": "Lucknow Chunmun", "value": "+919044349245" },
  { "name": "Mausi Yash", "value": "+916307917461" },
  { "name": "Shanu Di", "value": "6305763795" },
  { "name": "Mama Chunna", "value": "9919311099" },
  { "name": "Mami IIT", "value": "+919628130204" },
  { "name": "Sister Nawabganj Sony", "value": "6394318099" },
  { "name": "Mama IIT", "value": "9335677224" },
  { "name": "Lucknow Bari Ma", "value": "7388228356" },
  { "name": "Mausi Neeta", "value": "7376983260" },
  { "name": "Lucknow Rashmi", "value": "7007243176" },
  { "name": "Home Swaraj", "value": "7071702964" },
  { "name": "Shilpi Mam", "value": "+918954887788" },
  { "name": "Aarti Didi", "value": "+917518407828" },
  { "name": "Sister Nawabganj", "value": "9455907784" },
  { "name": "Dr. Shashsnk", "value": "9051248122" },
  { "name": "Mamta", "value": "+919140798422" },
  { "name": "Job Hunt Drive", "value": "9936417566" },
  { "name": "Indane Gas Gadi", "value": "8528105273" },
  { "name": "Kuldeep", "value": "08299106938" },
  { "name": "Major Dr Shashank Raikwar", "value": "+919410000058" },
  { "name": "Abhishek Awasthi", "value": "+918840579249" },
  { "name": "Ajay", "value": "+917905510187" },
  { "name": "Ankit Trivedi", "value": "+918429263856" },
  { "name": "Ankit Trivedi M", "value": "+917081540231" },
  { "name": "Ashutosh Msme", "value": "9140863651" },
  { "name": "Badi Ma Luck...", "value": "+918840877792" },
  { "name": "Home Sharad", "value": "7068028610" },
  { "name": "Harshit Thakur Jns", "value": "9027526258" },
  { "name": "Iti Job Update", "value": "7985474453" },
  { "name": "Kashi Sir", "value": "6307380426" },
  { "name": "Mama Mandhana", "value": "+917651902934" },
  { "name": "Puneet Mama", "value": "+919266200548" },
  { "name": "Mausi", "value": "+916387623817" },
  { "name": "Naveen", "value": "+918053849622" },
  { "name": "Navneet Reliance", "value": "7355337948" },
  { "name": "Nidhi Di", "value": "+919704175255" },
  { "name": "Nikki Bhai", "value": "8604138836" },
  { "name": "Nishant Chaurasiya", "value": "9956729846" },
  { "name": "Meet Pandey", "value": "+917007122502" },
  { "name": "Parade Dtdc Corrier", "value": "9451444986" },
  { "name": "Paytm Fse Og Abhishek Singh", "value": "+918299464680" },
  { "name": "Pinkee", "value": "9818349997" },
  { "name": "Plc", "value": "+918470926902" },
  { "name": "Prabhat Chaursiya 😂", "value": "+917376732302" },
  { "name": "Pramod Yadav", "value": "8090281244" },
  { "name": "Pramod Kushwaha", "value": "+918858544256" },
  { "name": "Reliance Deepak Raj", "value": "7897747128" },
  { "name": "Risabh Dixit", "value": "9511013074" },
  { "name": "Rishabh", "value": "6306053371" },
  { "name": "Rishabh Pal", "value": "+917518206732" },
  { "name": "Rishi Dubey", "value": "8934878787" },
  { "name": "Ritesh", "value": "+919506802654" },
  { "name": "Ritik Diwakar", "value": "+918707314826" },
  { "name": "Ritik", "value": "+917376325415" },
  { "name": "Sachin", "value": "+917881147943" },
  { "name": "Satakshi Dubey", "value": "+916306753034" },
  { "name": "Satish Singh", "value": "8400431125" },
  { "name": "Satish", "value": "+916388990717" },
  { "name": "Saurabh Shukla Reliance", "value": "7007401139" },
  { "name": "Shakti", "value": "+917521995116" },
  { "name": "Shani Chaurasiya", "value": "8840491660" },
  { "name": "Sharad Tripathi", "value": "+917408563104" },
  { "name": "Shiva Yadav", "value": "+919795833303" },
  { "name": "Shivam Dixit", "value": "9118902716" },
  { "name": "Shivanshu", "value": "+919569179972" },
  { "name": "Shivendra Mpec", "value": "+919125127431" },
  { "name": "Shobhit Mishra", "value": "7668591963" },
  { "name": "Shohit Sharma", "value": "7052140030" },
  { "name": "Divyam", "value": "+919335462864" },
  { "name": "Shubham Giri", "value": "9794176864" },
  { "name": "Shubham Agnihotri", "value": "8318331821" },
  { "name": "Shubham Tripathi", "value": "6394204720" },
  { "name": "Shyam Hr", "value": "9075782834" },
  { "name": "Siddhartha", "value": "9760903686" },
  { "name": "Singh Doctor", "value": "7393939190" },
  { "name": "Singh Bhojnalya", "value": "9140494299" },
  { "name": "Satish Pal", "value": "+918400598746" },
  { "name": "Suraj Guru", "value": "+916387555163" },
  { "name": "Suraj Kumar", "value": "+916392749241" },
  { "name": "Puneet Tiwari", "value": "+917651969374" },
  { "name": "Pushpendra Man", "value": "8957727142" },
  { "name": "Rahul Jio Fibre", "value": "6307384037" },
  { "name": "Raj Lalli", "value": "+919519239664" },
  { "name": "Rajat Awasthi", "value": "7985661469" },
  { "name": "Ram Cafe 2", "value": "6392426900" },
  { "name": "Ramakant", "value": "+917985413090" },
  { "name": "Ramu Kamal", "value": "7388255807" },
  { "name": "Ranjan", "value": "8789388697" },
  { "name": "Rasan", "value": "8317020548" },
  { "name": "Ratnesh", "value": "8411926986" },
  { "name": "Ravi Tiwari", "value": "8400236224" },
  { "name": "Vaibhav Awasthi", "value": "7398911209" },
  { "name": "Vicky", "value": "9873455594" },
  { "name": "Vikas", "value": "9053160925" },
  { "name": "Vineet Sharma", "value": "7348300728" },
  { "name": "Vineet Kapoor", "value": "7651988973" },
  { "name": "Vinod Bharawas", "value": "+919711161229" },
  { "name": "Vishal Mishra", "value": "+919695740637" },
  { "name": "Yash Bhai", "value": "+916307917461" },
  { "name": "Sarika", "value": "+917905805203" },
  { "name": "SGRG prabhat", "value": "8726161842" },
  { "name": "Sahr", "value": "8349358835" },
  { "name": "Naman", "value": "6307366545" },
  { "name": "Sangeeta", "value": "+919792428397" },
  { "name": "Harsh", "value": "9235080972" },
  { "name": "Lucknow Bulbul", "value": "8932877579" },
  { "name": "Riyanshu", "value": "+917860589938" },
  { "name": "SGRG Sandeep", "value": "7355382450" },
  { "name": "Abhinav Yadav", "value": "+916306270484" },
  { "name": "Anil", "value": "9554006379" },
  { "name": "Sega Mechelech Fazalganj", "value": "+916394896262" },
  { "name": "Lakshya", "value": "+919760948512" },
  { "name": "Saurabh Dubey", "value": "8896894140" },
  { "name": "Cafe", "value": "9307981334" },
  { "name": "Om Narayan", "value": "8853277799" },
  { "name": "Rashmi 2 Solar", "value": "+919889417980" },
  { "name": "Shailendra K Gupta", "value": "+919335975914" },
  { "name": "Dawai", "value": "+919839062108" },
  { "name": "Pnb Metlife", "value": "+918090065989" },
  { "name": "Neelesh", "value": "6204425057" },
  { "name": "kavi Govind Bajpai", "value": "+919793012838" },
  { "name": "SGRG akash", "value": "8318492923" },
  { "name": "Reena", "value": "9124449055" },
  { "name": "Rohini Pal", "value": "9648213386" },
  { "name": "Manu Kashyap", "value": "+918853246413" },
  { "name": "Rohan Sharma OT", "value": "+919044079058" },
  { "name": "Somya", "value": "+916387115815" },
  { "name": "SGRG GHANSHYAM", "value": "8960571905" },
  { "name": "Appluk", "value": "7970960199" },
  { "name": "Sonali", "value": "+918887624827" },
  { "name": "Vinod Pentar", "value": "9616380516" },
  { "name": "Shivam", "value": "+917784044202" },
  { "name": "Sachin Pal", "value": "9918613252" },
  { "name": "Anurag", "value": "+919198201133" },
  { "name": "Maa", "value": "9140867442" },
  { "name": "Nitesh Bhai", "value": "9016730265" },
  { "name": "Chay Wale Bhaiya", "value": "99560118352" },
  { "name": "Riddhi 3", "value": "8081633675" },
  { "name": "Bobby Kumar", "value": "+917388088096" },
  { "name": "Photo Copy", "value": "9140794847" },
  { "name": "Issue", "value": "9453600600" },
  { "name": "Centre", "value": "+919627962703" },
  { "name": "Satyam Bhaiya", "value": "9205209422" },
  { "name": "Rano(Ramman Ki Bahu)", "value": "+919129859680" },
  { "name": "Shipra", "value": "8318854010" },
  { "name": "Pushpendra", "value": "9935335729" },
  { "name": "Devendra", "value": "9653044462" },
  { "name": "Lucknow Barabanki", "value": "+917395066060" },
  { "name": "Shobhit SavitA", "value": "8604128412" },
  { "name": "Jitu Singh", "value": "8423822444" },
  { "name": "Shyamu Jns", "value": "9389509186" },
  { "name": "Rahul Bhaiya", "value": "7053638030" },
  { "name": "Bhoomi Ki Mummy", "value": "+919838379345" },
  { "name": "Mani", "value": "8382907343" },
  { "name": "Satish Jns", "value": "+919532493630" },
  { "name": "Vishal Lupin", "value": "8840304834" },
  { "name": "Indane Gas Booking", "value": "+917718955555" },
  { "name": "Sengar Bhai", "value": "8009314314" },
  { "name": "Deependra Mr", "value": "7007860231" },
  { "name": "Avishkar Placement Services", "value": "9422567995" },
  { "name": "Rajan", "value": "7007067095" },
  { "name": "Rakesh Rao", "value": "9453303726" },
  { "name": "Mustak .", "value": "+918078687835" },
  { "name": "Super Cloud", "value": "+917080805201" },
  { "name": "Bill", "value": "+919436796587" },
  { "name": "Placement Cell India", "value": "7905082629" },
  { "name": "Basant", "value": "9695386064" },
  { "name": "Azaj", "value": "8882975885" },
  { "name": "Farhan", "value": "6395898698" },
  { "name": "Yahia", "value": "7002522559" },
  { "name": "Ankit Trivedi2", "value": "+916388890656" },
  { "name": "Satyam Prajapati", "value": "+917080362990" },
  { "name": "Sambhav", "value": "8787012851" },
  { "name": "Saumyasheel Tripathi", "value": "7080160718" },
  { "name": "nishatiwari4344", "value": "+917458038161" },
  { "name": "Pintu Pem", "value": "8400263784" },
  { "name": "Jyoti Naukri", "value": "7309058621" },
  { "name": "Vipreesh Kumar", "value": "8853828884" },
  { "name": "Sbi", "value": "9022690226" },
  { "name": "Ramu 2", "value": "6394143392" },
  { "name": "Account", "value": "09223488888" },
  { "name": "Mr Aarif", "value": "+919644206942" },
  { "name": "Shiv", "value": "+919305970788" },
  { "name": "Rajat Book", "value": "8858992977" },
  { "name": "Thekedaar", "value": "9889445715" },
  { "name": "Subhash Patient", "value": "8787096664" },
  { "name": "Vivek Mishra", "value": "8795703513" },
  { "name": "Veena", "value": "+919455833077" },
  { "name": "Manoj Mandhana", "value": "8545027251" },
  { "name": "Vishal Tiwari", "value": "+917349756154" },
  { "name": "Soonam", "value": "9009306939" },
  { "name": "Suraj Career", "value": "9503637618" },
  { "name": "Ultrasound", "value": "+917084818866" },
  { "name": "Roman Solar", "value": "+917985770981" },
  { "name": "Lohia", "value": "+917311138283" },
  { "name": "Nishant", "value": "+919794695655" },
  { "name": "BOI Swaraj", "value": "8376006006" },
  { "name": "Awadesh Tiwari", "value": "7398403187" },
  { "name": "Rishabh Sharma", "value": "6386823948" },
  { "name": "Raja Sir", "value": "8434690049" },
  { "name": "Sony Didi", "value": "+918577961711" },
  { "name": "Anubhav 2", "value": "+919580587232" },
  { "name": "Beenu Bhaiya", "value": "9695790701" },
  { "name": "Abhinav Dwivedi 2", "value": "9695945386" },
  { "name": "Madhveen", "value": "+917607669804" },
  { "name": "Aditya Solar", "value": "+916386334529" },
  { "name": "Alok Mangal", "value": "9451704257" },
  { "name": "Ankit Patient", "value": "9336013156" },
  { "name": "Atif As", "value": "9000447522" },
  { "name": "Carinia", "value": "9235263908" },
  { "name": "Electrician", "value": "9335455293" },
  { "name": "Genome", "value": "8960522189" },
  { "name": "Himanshu Sharma", "value": "9981472718" },
  { "name": "Jija Ram Nagar 2", "value": "+919452177051" },
  { "name": "Jitendra Mama", "value": "+916388749732" },
  { "name": "joutikthariyajoyti", "value": "+918887620875" },
  { "name": "Ketul", "value": "+919979462719" },
  { "name": "Komal 2", "value": "+919554974365" },
  { "name": "Komal Yadav", "value": "9161868962" },
  { "name": "Meenu Mausi", "value": "+916392904082" },
  { "name": "Mohit", "value": "+916395800334" },
  { "name": "Naveen 2", "value": "8588063132" },
  { "name": "Neeraj Solar", "value": "8756526482" },
  { "name": "Patelnagar Crossing", "value": "9140965420" },
  { "name": "Prince Kushwaha", "value": "+919555772679" },
  { "name": "Pundit Ji", "value": "8920903385" },
  { "name": "Rajat 2", "value": "+917887215089" },
  { "name": "Rajesh", "value": "9369489309" },
  { "name": "Ranqers Power Industries", "value": "9511113902" },
  { "name": "Rashmi Bhabhi", "value": "+919936925666" },
  { "name": "Raunak", "value": "+917355456874" },
  { "name": "Ravendra Solar", "value": "6393133491" },
  { "name": "Riddhi", "value": "7275317859" },
  { "name": "Saurabh Bajpai", "value": "9795122546" },
  { "name": "Shib", "value": "7735964903" },
  { "name": "Shree Hans 2", "value": "9119943678" },
  { "name": "Shukla @ Arpan😎😎", "value": "+917905277893" },
  { "name": "Sundeep 2", "value": "+919125475261" },
  { "name": "Sunil Ro", "value": "9919015246" },
  { "name": "Tunesh", "value": "9233701782" },
  { "name": "Vikas Solar", "value": "+919005582001" },
  { "name": "RAM EMPLOYMENT OFFICE", "value": "9336433647" },
  { "name": "Anubhav", "value": "6392692839" },
  { "name": "Sonu", "value": "+919920360568" },
  { "name": "Yogesh", "value": "8009520859" },
  { "name": "ASHOK KUMAR", "value": "+918299154471" },
  { "name": "SGRG daljeet", "value": "7460087288" },
  { "name": "Siddhqui Poly", "value": "+917985427703" },
  { "name": "Vinay Mishra Pandit", "value": "9696345603" },
  { "name": "Paytm Fse Og Atif Kanpur", "value": "+917237858145" },
  { "name": "Devesh Pal", "value": "+917398422954" }
];

// 🔍 SMART LOCAL SEARCH ENGINE (With Country Code Ignores)
app.post('/api/search', async (req, res) => {
    let { number } = req.body;
    if (!number) return res.json({ success: false, message: "Number toh dalo bhai!" });

    // Remove +91, 91 or spaces from search input
    let cleanSearch = number.toString().replace(/\D/g, ''); 
    if (cleanSearch.startsWith('91') && cleanSearch.length > 10) {
        cleanSearch = cleanSearch.substring(2);
    } else if (cleanSearch.startsWith('0') && cleanSearch.length > 10) {
        cleanSearch = cleanSearch.substring(1);
    }

    // Dynamic Scanning over Embedded Array
    let match = embeddedContacts.find(contact => {
        let cleanContactValue = contact.value.replace(/\D/g, '');
        if (cleanContactValue.startsWith('91') && cleanContactValue.length > 10) {
            cleanContactValue = cleanContactValue.substring(2);
        } else if (cleanContactValue.startsWith('0') && cleanContactValue.length > 10) {
            cleanContactValue = cleanContactValue.substring(1);
        }
        return cleanContactValue === cleanSearch || cleanContactValue.includes(cleanSearch) || cleanSearch.includes(cleanContactValue);
    });

    if (match) {
        return res.json({
            success: true,
            found: true,
            data: { name: match.name, isSpam: false }
        });
    }

    // If not found in static JSON list, fall back to Firebase Realtime DB reported spammers
    if (db) {
        try {
            const ref = db.ref(`contacts/${number}`);
            const snapshot = await ref.once('value');
            if (snapshot.exists()) {
                return res.json({ success: true, found: true, data: snapshot.val() });
            }
        } catch (e) {
            console.log("Firebase fallback error");
        }
    }

    res.json({ success: true, found: false, message: "Yeh number database mein nahi mila." });
});

// 📥 API: Add or Report Spammer Numbers to Cloud
app.post('/api/report', async (req, res) => {
    const { number, name, isSpam } = req.body;
    if (!number || !name) return res.json({ success: false, message: "Details incomplete!" });
    if (!db) return res.json({ success: false, message: "Cloud Storage connection unavailable right now." });

    try {
        const ref = db.ref(`contacts/${number}`);
        await ref.set({ name, number, isSpam, reportedAt: new Date().toISOString() });
        res.json({ success: true, message: "Number successfully register ho gaya bhai!" });
    } catch (error) {
        res.json({ success: false, message: "Error writing to live engine." });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Truecaller Engine Active on port ${PORT}`);
});
