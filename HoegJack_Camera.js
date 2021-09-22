const CAM_PERSPECTIVE=0,CAM_ORTHO=1,CAM_FRUST=2,CAM_MAX=3;function Camera(){this.camType=CAM_PERSPECTIVE,this.fov=glMatrix.glMatrix.toRadian(45),this.upV=glMatrix.vec3.fromValues(0,0,1),glMatrix.vec3.normalize(this.upV,this.upV),this.yaw=-2.674836245760751,this.yawInit=this.yaw,this.yawStep=.02,this.pitch=-.6714504655472818,this.pitchInit=this.pitch,this.pitchStep=.015,this.eyePoint=glMatrix.vec4.fromValues(5.26588,2.03795,5.9164667,1),this.lookPoint=glMatrix.vec4.fromValues(0,0,0,1),this.dollySpeed=.5,this.znear=1,this.zfar=1e4,this.zdist=(this.zfar-this.znear)/3,this.perAspect,this.halfHeight=this.zdist*Math.tan(Math.PI/9),this.halfWidth=this.halfHeight*this.perAspect,this.changed=!0,this.viewMat=glMatrix.mat4.create(),this.projMat=glMatrix.mat4.create(),this.vp=glMatrix.mat4.create(),this.mvp=glMatrix.mat4.create()}Camera.prototype.init=function(t,i){this.aim(0,0),this.refreshAspect(t,i),this.refreshView(),this.refreshVP()},Camera.prototype.camStart=function(t){glMatrix.mat4.identity(t),glMatrix.mat4.multiply(t,t,this.vp)},Camera.prototype.changeType=function(){this.camType+=1,this.camType%=CAM_MAX,this.refreshProj()},Camera.prototype.refreshAspect=function(t,i){this.perAspect=t/i,this.refreshProj()},Camera.prototype.refreshView=function(){glMatrix.mat4.lookAt(this.viewMat,this.eyePoint,this.lookPoint,this.upV),this.changed=!0},Camera.prototype.refreshProj=function(){switch(this.camType){default:case CAM_PERSPECTIVE:glMatrix.mat4.perspective(this.projMat,this.fov,this.perAspect,this.znear,this.zfar);break;case CAM_ORTHO:this.halfWidth=this.halfHeight*this.perAspect,glMatrix.mat4.ortho(this.projMat,-this.halfWidth,this.halfWidth,-this.halfHeight,this.halfHeight,this.znear,this.zfar);break;case CAM_FRUST:}this.changed=!0},Camera.prototype.refreshVP=function(){this.vp=glMatrix.mat4.clone(this.projMat),glMatrix.mat4.multiply(this.vp,this.vp,this.viewMat),this.changed=!1,this.refreshMVP()},Camera.prototype.refreshMVP=function(){glMatrix.mat4.identity(this.mvp),glMatrix.mat4.multiply(this.mvp,this.mvp,this.vp)},Camera.prototype.getForwardDir=function(){var t=glMatrix.vec3.create();return glMatrix.vec3.sub(t,this.lookPoint,this.eyePoint),glMatrix.vec3.normalize(t,t),t},Camera.prototype.getSideDir=function(){var t=glMatrix.vec3.create();return glMatrix.vec3.sub(t,this.lookPoint,this.eyePoint),glMatrix.vec3.cross(t,t,this.upV),glMatrix.vec3.normalize(t,t),t},Camera.prototype.dollyForward=function(){var t=glMatrix.vec3.create();glMatrix.vec3.sub(t,this.lookPoint,this.eyePoint),glMatrix.vec3.normalize(t,t),glMatrix.vec3.scale(t,t,this.dollySpeed),glMatrix.vec3.add(this.eyePoint,this.eyePoint,t),glMatrix.vec3.add(this.lookPoint,this.lookPoint,t),glMatrix.vec3.negate(t,t),glMatrix.mat4.translate(this.viewMat,this.viewMat,t),this.changed=!0},Camera.prototype.dollyBack=function(){var t=glMatrix.vec3.create();glMatrix.vec3.sub(t,this.lookPoint,this.eyePoint),glMatrix.vec3.normalize(t,t),glMatrix.vec3.scale(t,t,-this.dollySpeed),glMatrix.vec3.add(this.eyePoint,this.eyePoint,t),glMatrix.vec3.add(this.lookPoint,this.lookPoint,t),glMatrix.vec3.negate(t,t),glMatrix.mat4.translate(this.viewMat,this.viewMat,t),this.changed=!0},Camera.prototype.dollyLeft=function(){var t=glMatrix.vec3.create();glMatrix.vec3.sub(t,this.lookPoint,this.eyePoint),glMatrix.vec3.cross(t,t,this.upV),glMatrix.vec3.normalize(t,t),glMatrix.vec3.scale(t,t,-this.dollySpeed),glMatrix.vec3.add(this.eyePoint,this.eyePoint,t),glMatrix.vec3.add(this.lookPoint,this.lookPoint,t),glMatrix.vec3.negate(t,t),glMatrix.mat4.translate(this.viewMat,this.viewMat,t),this.changed=!0},Camera.prototype.dollyRight=function(){var t=glMatrix.vec3.create();glMatrix.vec3.sub(t,this.lookPoint,this.eyePoint),glMatrix.vec3.cross(t,t,this.upV),glMatrix.vec3.normalize(t,t),glMatrix.vec3.scale(t,t,this.dollySpeed),glMatrix.vec3.add(this.eyePoint,this.eyePoint,t),glMatrix.vec3.add(this.lookPoint,this.lookPoint,t),glMatrix.vec3.negate(t,t),glMatrix.mat4.translate(this.viewMat,this.viewMat,t),this.changed=!0},Camera.prototype.aim=function(t,i){this.tilt(i),this.pan(t)},Camera.prototype.tilt=function(t){this.pitch=this.pitchInit+t,this.pitch<.5*-Math.PI?this.pitch=.5*-Math.PI+.01:this.pitch>.5*Math.PI&&(this.pitch=.5*Math.PI);t=Math.cos(this.pitch);this.lookPoint[0]=this.eyePoint[0]+Math.cos(this.yaw)*t,this.lookPoint[1]=this.eyePoint[1]+Math.sin(this.yaw)*t,this.lookPoint[2]=this.eyePoint[2]+Math.sin(this.pitch)},Camera.prototype.pan=function(t){this.yaw=this.yawInit+t,this.yaw<-Math.PI?this.yaw+=2*Math.PI:this.yaw>Math.PI&&(this.yaw-=2*Math.PI);t=Math.cos(this.pitch);this.lookPoint[0]=this.eyePoint[0]+Math.cos(this.yaw)*t,this.lookPoint[1]=this.eyePoint[1]+Math.sin(this.yaw)*t},Camera.prototype.craneUp=function(){this.eyePoint[2]+=this.dollySpeed,this.lookPoint[2]+=this.dollySpeed,this.pitch=this.lookPoint[2];var t=glMatrix.vec3.clone(this.upV),t=glMatrix.vec3.scale(t,t,-this.dollySpeed);glMatrix.mat4.translate(this.viewMat,this.viewMat,t),this.changed=!0},Camera.prototype.craneDown=function(){this.eyePoint[2]-=this.dollySpeed,this.lookPoint[2]-=this.dollySpeed,this.pitch=this.lookPoint[2];var t=glMatrix.vec3.clone(this.upV),t=glMatrix.vec3.scale(t,t,this.dollySpeed);glMatrix.mat4.translate(this.viewMat,this.viewMat,t),this.changed=!0};