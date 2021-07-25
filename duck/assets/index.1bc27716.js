var t=Object.defineProperty,i=Object.getOwnPropertySymbols,e=Object.prototype.hasOwnProperty,s=Object.prototype.propertyIsEnumerable,a=(i,e,s)=>e in i?t(i,e,{enumerable:!0,configurable:!0,writable:!0,value:s}):i[e]=s,o=(t,o)=>{for(var n in o||(o={}))e.call(o,n)&&a(t,n,o[n]);if(i)for(var n of i(o))s.call(o,n)&&a(t,n,o[n]);return t},n=(t,i,e)=>(a(t,"symbol"!=typeof i?i+"":i,e),e);import{T as r,M as h,a as l,P as p,G as d,A as c,b as m,S as w,c as g,W as u,d as v,e as f,f as x,B as b,V as k,R as S,C as P,g as y}from"./vendor.de9c479e.js";const z=(new r).load("textures/blanket_texture.png"),A=new h({map:z});class M{constructor({x:t,z:i,theta:e}){const s=new l(new p(14,7,1,1),A);s.rotation.x=-Math.PI/2,s.rotation.z=e,s.position.y=.1,s.position.x=t,s.position.z=i,this.blanket=s,this.position=s.position,this.duck=null,this.food=null}}const R=new d;function T(t,i){const e=t.x-i.x,s=t.z-i.z;return{dx:e,dz:s,dist:(e**2+s**2)**.5}}const j=100,D=class{constructor(t,i,e){this.blanket=t,this.theta=i,this.target={position:null,rotation:null},this.state=D.states.loading,this.arrival=0,this.food=null,this.position={x:j*Math.cos(this.theta),y:0,z:j*Math.sin(this.theta)},this.positionSpeed=.1,this.positionEps=2.1*this.positionSpeed,this.rotation=0,this.source=o({},this.position),this.initialFoodDist=0,this.review=null,this.rotationSpeed=.05,this.rotationEps=2.1*this.rotationSpeed,this.camera=e,this.prevAnimations=[]}setAnimations(t){const i=this.model.animations;for(let e of this.prevAnimations){let t=c.findByName(i,e);this.mixer.clipAction(t).stop()}for(let e of t){let t=c.findByName(i,e);this.mixer.clipAction(t).play()}this.prevAnimations=t}setAnimation(t){this.setAnimations([t])}remove(){console.log("remove")}setRotation(t){this.rotation=t}setPosition(t){this.position=t}move(){const{dx:t,dz:i,dist:e}=T(this.position,this.target.rotation);this.dist=e;const s=(Math.PI+Math.atan2(t,i)-this.rotation)%(2*Math.PI);Math.abs(s)>this.rotationEps&&this.setRotation(this.rotation+(s<Math.PI?1:-1)*this.rotationSpeed),null!==this.target.position&e>this.positionEps&&this.setPosition(o(o({},this.position),{x:this.position.x-this.positionSpeed*t/e,z:this.position.z-this.positionSpeed*i/e}))}update(t){if(this.state!==D.states.removed){if(this.mixer&&this.mixer.update(t),null!==this.target.rotation&&this.move(),this.state===D.states.approchingBlanket&&this.dist<this.positionEps&&this.setState(D.states.patient),[D.states.patient,D.states.impatient].includes(this.state)){const t=.001*(new Date-this.arrival);if(null!==this.blanket.food)return this.food=this.blanket.food,void this.setState(D.states.approachingFood);this.state===D.states.patient?t>5&&this.setState(D.states.impatient):this.state===D.states.impatient&&t>10&&this.setState(D.states.leaving)}else if(this.state===D.states.eating){.001*(new Date-this.eatStart)>2&&this.setState(D.states.leaving)}else this.state===D.states.leaving&&this.dist<this.positionEps&&this.setState(D.states.removed);for(let t in this.position)this.model.scene.position[t]=this.position[t];this.model.scene.rotation.y=this.rotation}}setRotationTarget(t){this.target.rotation=t}setPositionTarget(t){this.target.position=t}getReviewScore(){return 2.5*(.001*(1-(new Date-this.arrival)/10)+.001*(1-this.initialFoodDist/100))}setState(t){t===D.states.approchingBlanket&&(this.setPositionTarget(this.blanket.position),this.setRotationTarget(this.blanket.position),this.setAnimation(D.animations.walking)),t===D.states.patient&&(this.setPositionTarget(null),this.setRotationTarget(this.camera.position),this.setAnimation(D.animations.idle),this.arrival=new Date,this.blanket.duck=this),t===D.states.impatient&&this.setAnimations([D.animations.tapping,D.animations.idle]),t===D.states.approachingFood&&(this.initialFoodDist=T(this.position,this.food.position).dist,this.setPositionTarget(this.food.position),this.setRotationTarget(this.food.position),this.setAnimation(D.animations.walking)),t===D.states.eating&&(this.review=this.getReviewScore(),this.setAnimation(D.animations.pecking),this.eatStart=new Date),t===D.states.leaving&&(null===this.review&&(this.review=0),this.setAnimation(D.animations.walking),this.setRotationTarget(this.source),this.setPositionTarget(this.source)),this.state=t}async load(){var t;this.setState(D.states.loading),this.model=await(t="duck.glb",new Promise(((i,e)=>{R.load(t,(t=>i(t)),null,e)}))),this.mixer=new m(this.model.scene),this.model.scene.position.x=j*Math.cos(this.theta),this.model.scene.position.z=j*Math.sin(this.theta),this.setState(D.states.loaded)}};let E=D;n(E,"animations",{idle:"idle",walking:"walk",pecking:"pecking",tapping:"tap"}),n(E,"states",{loading:-1,loaded:0,approchingBlanket:1,patient:2,impatient:3,approachingFood:4,eating:5,leaving:6,removed:7});const O=t=>Math.PI/180*t,B=new w,F=new y,I=new g(75,window.innerWidth/window.innerHeight,.1,1e3),W=new u({canvas:document.querySelector("#bg")});I.position.set(0,10,0),W.setPixelRatio(window.devicePixelRatio),W.setSize(window.innerWidth,window.innerHeight),W.render(B,I);const H=new v(16777215);H.position.set(0,10,0);const _=new f(16777215,2);B.add(H,_);const q=function(){const t=(new r).load("textures/lawn_texture_small.jpg");t.wrapS=S,t.wrapT=S,t.repeat.set(14,14);const i=new l(new P(100,50),new h({map:t}));return i.rotation.x=-Math.PI/2,i.position.y=0,i.position.x=0,i.position.z=0,i}();B.add(q);var L=new x(500,100,100),N=(new r).load("textures/sky.png"),C=new h({map:N}),G=new l(L,C);G.material.side=b,B.add(G);const V=[{x:-5,z:-20,theta:-3.1},{x:-30,z:-30,theta:-.3},{x:3,z:-40,theta:-2.2},{x:20,z:-28,theta:3.1},{x:-20,z:-40,theta:-.9}].map((t=>new M(t)));V.map((t=>B.add(t.blanket)));const X=new E(V[0],4.5,I);X.load(),function t(){const i=F.getDelta();W.render(B,I),X.state!==E.states.loading&&(X.state===E.states.removed&&B.remove(X.model.scene),X.state===E.states.loaded&&(B.add(X.model.scene),X.setState(E.states.approchingBlanket)),X.update(i)),requestAnimationFrame(t)}();const Y={prev:{alpha:0,beta:0,gamma:0},curr:{alpha:0,beta:0,gamma:0},delta:{alpha:0,beta:0,gamma:0}};let J=null;window.addEventListener("deviceorientation",(t=>{let i=!1;for(let e of Object.keys(Y.curr))Y.curr[e]=null===t[e]?0:t[e],Y.delta[e]=Y.curr[e]-Y.prev[e],Math.abs(Y.delta[e])>.1&&(i=!0);if(i){null===J&&(J=Y.curr.alpha);for(let t of["x","y","z"])I.rotation[t]=0;I.rotateOnWorldAxis(new k(0,1,0),O(Y.curr.alpha-J)),I.rotateY(O(Y.curr.gamma)),I.rotateX(O(-90+Y.curr.beta));for(let t of Object.keys(Y.curr))Y.prev[t]=Y.curr[t]}})),window.addEventListener("resize",(function(){I.aspect=window.innerWidth/window.innerHeight,I.updateProjectionMatrix(),W.setSize(window.innerWidth,window.innerHeight),W.setPixelRatio(window.devicePixelRatio)}),!1);
