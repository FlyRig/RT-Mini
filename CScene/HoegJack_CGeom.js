const RT_GNDPLANE=0,RT_DISK=1,RT_SPHERE=2,RT_BOX=3,RT_CYLINDER=4,RT_TRIANGLE=5,RT_BLOBBY=6;function CGeom(t){switch(null==t&&(t=RT_GNDPLANE),this.shapeType=t,this.shapeType){case RT_GNDPLANE:this.traceMe=function(t,r){this.traceGrid(t,r)},this.xgap=1,this.ygap=1,this.lineWidth=.1,this.lineColor=new Material(2),this.gapColor=new Material(20);break;case RT_DISK:this.traceMe=function(t,r){this.traceDisk(t,r)},this.xgap=61/107,this.ygap=61/107,this.lineWidth=.1,this.lineColor=glMatrix.vec4.fromValues(.1,.5,.1,1),this.gapColor=glMatrix.vec4.fromValues(.9,.9,.9,1);break;case RT_SPHERE:this.traceMe=function(t,r){this.traceSphere(t,r)};break;case RT_BOX:this.traceMe=function(t,r){this.traceBox(t,r)};break;case RT_CYLINDER:this.traceMe=function(t,r){this.traceCyl(t,r)};break;case RT_TRIANGLE:this.traceMe=function(t,r){this.traceTri(t,r)};break;case RT_BLOBBY:this.traceMe=function(t,r){this.traceBlobby(t,r)};break;default:return void console.log("CGeom() constructor: ERROR! INVALID shapeSelect:",t)}this.worldRay2model=glMatrix.mat4.create(),this.normal2world=glMatrix.mat4.create()}CGeom.prototype.setIdent=function(){glMatrix.mat4.identity(this.worldRay2model),glMatrix.mat4.identity(this.normal2world)},CGeom.prototype.rayTranslate=function(t,r,i){var e=glMatrix.mat4.create();e[12]=-t,e[13]=-r,e[14]=-i,glMatrix.mat4.multiply(this.worldRay2model,e,this.worldRay2model),glMatrix.mat4.transpose(this.normal2world,this.worldRay2model)},CGeom.prototype.rayRotate=function(t,r,i,e){var a=r,o=i,l=e,d=Math.sqrt(a*a+o*o+l*l);if(Math.abs(d)<1e-6)return console.log("CGeom.rayRotate() ERROR!!! zero-length axis vector!!"),null;a*=d=1/d,o*=d,l*=d;var g=Math.sin(-t),c=a*a*(M=1-(m=Math.cos(-t)))+m,s=a*o*M-l*g,r=a*l*M+o*g,i=o*a*M+l*g,e=o*o*M+m,d=o*l*M-a*g,t=l*a*M-o*g,g=l*o*M+a*g,M=l*l*M+m,m=glMatrix.mat4.create();m[0]=c,m[4]=s,m[8]=r,m[12]=0,m[1]=i,m[5]=e,m[9]=d,m[13]=0,m[2]=t,m[6]=g,m[10]=M,m[14]=0,m[3]=0,m[7]=0,m[11]=0,m[15]=1,glMatrix.mat4.multiply(this.worldRay2model,m,this.worldRay2model),glMatrix.mat4.transpose(this.normal2world,this.worldRay2model)},CGeom.prototype.rayScale=function(t,r,i){if(Math.abs(t)<2e-6||Math.abs(r)<2e-6||Math.abs(i)<2e-6)return console.log("CGeom.rayScale() ERROR!! zero-length scale!!!"),null;var e=glMatrix.mat4.create();e[0]=1/t,e[5]=1/r,e[10]=1/i,glMatrix.mat4.multiply(this.worldRay2model,e,this.worldRay2model),glMatrix.mat4.transpose(this.normal2world,this.worldRay2model)},CGeom.prototype.traceGrid=function(t,r){var i=new CRay;glMatrix.vec4.transformMat4(i.orig,t.orig,this.worldRay2model),glMatrix.vec4.transformMat4(i.dir,t.dir,this.worldRay2model);var e=-i.orig[2]/i.dir[2];e<2e-6||e>r.t0||(r.t0=e,r.hitGeom=this,glMatrix.vec4.scaleAndAdd(r.modelHitPt,i.orig,i.dir,r.t0),glMatrix.vec4.copy(r.hitPt,r.modelHitPt),glMatrix.vec4.negate(r.viewN,t.dir),glMatrix.vec4.normalize(r.viewN,r.viewN),glMatrix.vec4.set(r.surfNorm,0,0,1,0),t=r.modelHitPt[0]/this.xgap,(t=r.modelHitPt[0]<0?-t:t)%1<this.lineWidth?r.hitNum=1:(t=r.modelHitPt[1]/this.ygap,(t=r.modelHitPt[1]<0?-t:t)%1<this.lineWidth?r.hitNum=1:r.hitNum=0))},CGeom.prototype.traceDisk=function(t,r){var i=new CRay;glMatrix.vec4.copy(i.orig,t.orig),glMatrix.vec4.copy(i.dir,t.dir),glMatrix.vec4.transformMat4(i.orig,t.orig,this.worldRay2model),glMatrix.vec4.transformMat4(i.dir,t.dir,this.worldRay2model);var e,a=-i.orig[2]/i.dir[2];a<0||a>r.t0||(e=glMatrix.vec4.create(),glMatrix.vec4.scaleAndAdd(e,i.orig,i.dir,a),1<e[0]*e[0]+e[1]*e[1]||(r.t0=a,r.hitGeom=this,glMatrix.vec4.copy(r.modelHitPt,e),glMatrix.vec4.scaleAndAdd(r.hitPt,t.orig,t.dir,r.t0),glMatrix.vec4.negate(r.viewN,t.dir),glMatrix.vec4.normalize(r.viewN,r.viewN),glMatrix.vec4.transformMat4(r.surfNorm,glMatrix.vec4.fromValues(0,0,1,0),this.normal2world),glMatrix.vec3.normalize(r.surfNorm,r.surfNorm),t=r.modelHitPt[0]/this.xgap,(t=r.modelHitPt[0]<0?-t:t)%1<this.lineWidth?r.hitNum=0:(t=r.modelHitPt[1]/this.ygap,(t=r.modelHitPt[1]<0?-t:t)%1<this.lineWidth?r.hitNum=0:r.hitNum=1)))},CGeom.prototype.traceSphere=function(t,r){var i=new CRay;glMatrix.vec4.copy(i.orig,t.orig),glMatrix.vec4.copy(i.dir,t.dir),glMatrix.vec4.transformMat4(i.orig,t.orig,this.worldRay2model),glMatrix.vec4.transformMat4(i.dir,t.dir,this.worldRay2model);var e=glMatrix.vec4.create();glMatrix.vec4.subtract(e,glMatrix.vec4.fromValues(0,0,0,1),i.orig);var a,o=glMatrix.vec3.dot(e,e);o<=1||((a=glMatrix.vec3.dot(i.dir,e))<0||(1<(o=o-a*a/(e=glMatrix.vec3.dot(i.dir,i.dir)))||((e=a/e-Math.sqrt((1-o)/e))>r.t0||(r.t0=e,r.hitGeom=this,glMatrix.vec4.scaleAndAdd(r.modelHitPt,i.orig,i.dir,r.t0),glMatrix.vec4.scaleAndAdd(r.hitPt,t.orig,t.dir,r.t0),glMatrix.vec4.negate(r.viewN,t.dir),glMatrix.vec4.normalize(r.viewN,r.viewN),glMatrix.vec4.transformMat4(r.surfNorm,r.modelHitPt,this.normal2world),r.hitNum=1))))},CGeom.prototype.traceBox=function(t,r){var i=new CRay;glMatrix.vec4.copy(i.orig,t.orig),glMatrix.vec4.copy(i.dir,t.dir),glMatrix.vec4.transformMat4(i.orig,t.orig,this.worldRay2model),glMatrix.vec4.transformMat4(i.dir,t.dir,this.worldRay2model);for(var e,a,o=-r.t0,l=r.t0,d=0,d=0;d<3;d++)if(0==i.dir[d]){if(1<Math.abs(i.orig[d]))return}else{var g,c=(-1-i.orig[d])/i.dir[d],s=(1-i.orig[d])/i.dir[d];if(s<c&&(g=c,c=s,s=g),o<c&&(o=c,0==d?e=glMatrix.vec4.fromValues(1,0,0,0):1==d?e=glMatrix.vec4.fromValues(0,1,0,0):2==d&&(e=glMatrix.vec4.fromValues(0,0,1,0))),(l=s<l?s:l)<o)return;if(l<0)return}o<0||o>r.t0||(r.t0=o,a=glMatrix.vec4.create(),glMatrix.vec4.scaleAndAdd(a,i.orig,i.dir,o),r.hitGeom=this,glMatrix.vec4.copy(r.modelHitPt,a),glMatrix.vec4.scaleAndAdd(r.hitPt,t.orig,t.dir,r.t0),glMatrix.vec4.negate(r.viewN,t.dir),glMatrix.vec4.normalize(r.viewN,r.viewN),glMatrix.vec4.transformMat4(r.surfNorm,e,this.normal2world),r.hitNum=1)},CGeom.prototype.traceCyl=function(t,r){var i=new CRay;glMatrix.vec4.copy(i.orig,t.orig),glMatrix.vec4.copy(i.dir,t.dir),glMatrix.vec4.transformMat4(i.orig,t.orig,this.worldRay2model),glMatrix.vec4.transformMat4(i.dir,t.dir,this.worldRay2model);var e,a,o,l,d=glMatrix.vec2.squaredLength(i.dir),g=i.orig[0]*i.dir[0]+i.orig[1]*i.dir[1],c=(g*=2)*g-4*d*(glMatrix.vec2.squaredLength(i.orig)-1);c<0||(a=1/(2*d),l=(-g+(c=Math.sqrt(c)))*a,o=r.t0,e=r.t0,d=i.orig[2]+l*i.dir[2],c=i.orig[2]+(g=(-g-c)*a)*i.dir[2],a=-1,(d<0&&0<c||c<0&&0<d)&&(o=-i.orig[2]/i.dir[2],a=0),(d<1&&1<c||c<1&&1<c)&&(e=(1-i.orig[2])/i.dir[2],a=1),0<o?0<e&&(o=Math.min(o,e)):o=0<e?e:r.t0,l<0?l=g<0?r.t0:g:0<g&&(l=Math.min(l,g)),g=l,1<i.orig[2]?1==a&&(g=o):i.orig[2]<0&&0==a&&(g=o),g<0||g>r.t0||(o=glMatrix.vec4.create(),glMatrix.vec4.scaleAndAdd(o,i.orig,i.dir,g),o[2]>1+2e-6||o[2]<-2e-6||glMatrix.vec2.length(o)>1+2e-6||(r.t0=g,r.hitGeom=this,glMatrix.vec4.copy(r.modelHitPt,o),glMatrix.vec4.scaleAndAdd(r.hitPt,t.orig,t.dir,r.t0),glMatrix.vec4.negate(r.viewN,t.dir),glMatrix.vec4.normalize(r.viewN,r.viewN),r.hitNum=1,r.t0==l?(l=glMatrix.vec4.fromValues(r.modelHitPt[0],r.modelHitPt[1],0,0),glMatrix.vec4.transformMat4(r.surfNorm,l,this.normal2world)):glMatrix.vec4.transformMat4(r.surfNorm,glMatrix.vec4.fromValues(0,0,1,0),this.normal2world))))},CGeom.prototype.traceTri=function(t,r){var i=new CRay;glMatrix.vec4.copy(i.orig,t.orig),glMatrix.vec4.copy(i.dir,t.dir),glMatrix.vec4.transformMat4(i.orig,t.orig,this.worldRay2model),glMatrix.vec4.transformMat4(i.dir,t.dir,this.worldRay2model);var e,a,o,l,d,g=-i.orig[2]/i.dir[2];g<0||g>r.t0||(a=glMatrix.vec4.fromValues(-1,0,0,1),glMatrix.vec4.fromValues(1,0,0,1),glMatrix.vec4.fromValues(0,1,0,1),l=glMatrix.vec4.fromValues(2,0,0,0),o=glMatrix.vec4.fromValues(1,1,0,0),d=glMatrix.vec4.create(),e=glMatrix.vec4.create(),glMatrix.vec4.scaleAndAdd(e,i.orig,i.dir,g),glMatrix.vec4.subtract(d,e,a),i=glMatrix.vec2.dot(o,o),a=glMatrix.vec2.dot(o,l),o=glMatrix.vec2.dot(o,d),dot11=glMatrix.vec2.dot(l,l),i=(i*(l=glMatrix.vec2.dot(l,d))-a*o)*(d=1/(i*dot11-a*a)),0<=(d=(dot11*o-a*l)*d)&&0<=i&&d+i<1&&(r.t0=g,r.hitGeom=this,glMatrix.vec4.copy(r.modelHitPt,e),glMatrix.vec4.scaleAndAdd(r.hitPt,t.orig,t.dir,r.t0),glMatrix.vec4.normalize(r.viewN,r.viewN),glMatrix.vec4.transformMat4(r.surfNorm,glMatrix.vec4.fromValues(0,0,1,0),this.normal2world),r.hitNum=1))},CGeom.prototype.traceTorus=function(t,r){var i=new CRay;glMatrix.vec4.copy(i.orig,t.orig),glMatrix.vec4.copy(i.dir,t.dir),glMatrix.vec4.transformMat4(i.orig,t.orig,this.worldRay2model),glMatrix.vec4.transformMat4(i.dir,t.dir,this.worldRay2model);var e=glMatrix.vec3.dot(i.orig,i.dir),t=glMatrix.vec3.dot(i.dir,i.dir),t=(glMatrix.vec3.dot(i.dir,i.orig),2*t*(glMatrix.vec3.dot(i.orig,i.orig)-4.25)+4*e*e);t+=16*i.dir[1]*i.dir[1];glMatrix.vec3.dot(i.orig,i.orig);i.dir[1],i.orig[1];glMatrix.vec3.dot(i.orig,i.orig),glMatrix.vec3.dot(i.orig,i.orig);i.orig[1],i.orig[1]};