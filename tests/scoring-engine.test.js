import { scoreProfile } from '../scoring-engine.js';

function assert(cond,msg){
  if(!cond){
    throw new Error(msg);
  }
}

(async()=>{
  const profile={
    connections:10,
    summary:"Results-driven engineer with proven track record",
    github:null,
    email:"devjohn@gmail.com"
  };

  const result=await scoreProfile(profile);

  assert(result.score>0,'score should be positive');
  assert(result.signals.length>0,'signals should exist');

  console.log('tests passed');
})();
