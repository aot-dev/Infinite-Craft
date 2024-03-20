export const initData = [{
    result:'Water', emoji:'💧', id:1, left:0, top:0, isSelected: false
  },
  {
    result:'Fire', emoji:'🔥', id:2, left:0, top:0, isSelected: false
  },
  {
    result:'Plant', emoji:'🌱', id:3, left:0, top:0, isSelected: false
  },
  {
    result:'Wind', emoji:'🌬️', id:4, left:0, top:0, isSelected: false
  },
  {
    result:'Earth', emoji:'🌍', id:5, left:0, top:0, isSelected: false
  }
];
const resultData:any= {
  'Water':{
    'Water': ['Lake','🌊'],
    'Fire': ['Steam','💨'],
    'Wind':['Wave','🌊'],
    'Earth':['Plant','🌱'],
    'Plant':['Swamp','🐊']
  },
  'Fire':{
    'Water': ['Steam','💨'],
    'Fire':['Valcono','🌋'],
    'Wind':['Smoke','💨'],
    'Earth':['Lava','🌋'],
  },
  'Wind':{
    'Water': ['Wave','🌊'],
    'Fire': ['Steam','💨'],
    'Wind':['Tornado','🌪️'],
    'Earth':['Dust','🌫️'],
    'Plant':['Swamp','🐊']
  },
  'Earth':{
    'Water': ['Plant','🌱'],
    'Fire': ['Lava','🌋'],
    'Wind':['Dust','🌫️'],
    'Earth':['Mountain','🏔️'],
  }
}
export const getResult=(elem1:string,elem2:string)=>{
  const possibleResults = resultData[elem1];
  if(!possibleResults){
    return [`${elem1} ${elem2}`,'']
  }
  console.log(elem1, elem2, possibleResults);
  return possibleResults[elem2];

}