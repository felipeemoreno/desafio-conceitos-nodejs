const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: isUuid, v4, validate } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());


function checkValidId(request, response, next){
  const { id } = request.params;

  if(!validate(id)){
      return response.status(400).json({error : 'Invalid repositorie ID.'});
  }

  return next();
}

app.use('/repositories/:id', checkValidId);

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.status(200).json(repositories);
});

app.post("/repositories", (request, response) => {
  
  const { title, url, techs } = request.body;

  const repositorie = {
    id: v4(),
    title,
    url,
    techs,
    likes: 0,
  }

  repositories.push(repositorie);

  return response.json(repositorie);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  
  const repositorieIdx = repositories.findIndex(repositorie => repositorie.id === id);

  if(repositorieIdx < 0){
    return response.status(400).json( {error : "Repositorie ID not found."});
  }

  const { title, url, techs } = request.body;

  const { likes } =  repositories[repositorieIdx];

  const repositorie = {
    id,
    title,
    url,
    techs,
    likes
  }

  repositories[repositorieIdx] = repositorie;

  return response.json(repositorie);


});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
  
  const repositorieIdx = repositories.findIndex(repositorie => repositorie.id === id);

  if(repositorieIdx < 0){
    return response.status(400).json( {error : "Repositorie ID not found."});
  }
  
  repositories.splice(repositorieIdx, 1);

  //204 return success no content.
  return response.status(204).send();

});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositorieIdx = repositories.findIndex(repositorie => repositorie.id === id);

  if(repositorieIdx < 0){
    return response.status(400).json( {error : "Repositorie ID not found."});
  }

  const repositorie = repositories[repositorieIdx]
  repositorie.likes++;

  repositories[repositorieIdx] = repositorie;

  return response.json(repositorie);
  
});

module.exports = app;
