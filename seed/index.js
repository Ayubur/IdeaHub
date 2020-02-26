const faker= require('faker');
const axios = require('axios');

const IDEA_GENERATOR = 'https://appideagenerator.com/call.php';
const IDEA_API= `http://localhost:3090`;

const randomInt= ()=> Math.floor(Math.random()*10);

const generateIdeas = async()=>{
    const {data}= await axios.get(IDEA_GENERATOR);
    return data.replace(/\n/g,'');
}

const generateUsers = async ()=>{
    const {data}= await  axios.post(`${IDEA_API}/register`,{
        username: faker.internet.userName(),
        email : faker.internet.email(),
        password: 'password'
    });

    return data.token;
}


const postIdeas = async (token)=>{
    const idea = await generateIdeas();
    const {data}= await axios.post(`${IDEA_API}/api/ideas`,{
        idea,
        description : faker.lorem.paragraph()
    },{
        headers:{
            authorization: `Bearer ${token}`
        }
    });

    return data;

}

(async ()=>{
    const randomUser = randomInt();
    const randomIdeas = randomInt();

    for(let i=0;i<=randomUser;i++){
        const token = await generateUsers();

        for(let j=0;j<=randomIdeas;j++){
            const idea=  await postIdeas(token);
            console.log(idea);
        }
    }
})();