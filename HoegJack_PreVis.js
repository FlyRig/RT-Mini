const idMat=glMatrix.mat4.create();function PreVis(){this.VSHADER_SOURCE=`#version 300 es
 		struct Light {
 			vec4 pos;
 			vec3 ambi;
 			vec3 diff;
 			vec3 spec;
 			bool attn;
 		};
 		
 		struct Matl {
 			vec3 emit;
 			vec3 ambi;
 			vec3 diff;
 			vec3 spec;
 			float shiny;
 		};
 	
 		in vec4 a_Position;
 		in vec4 a_Normal;
 		
 		uniform Light u_LampSet[2];
 		uniform Matl u_MatlSet[1];
 		uniform mat4 u_VpMatrix;
 		uniform mat4 u_ModelMatrix;
 		uniform mat4 u_NormalMatrix;
 		uniform vec4 u_eyePosWorld;
 		
 		out vec4 v_Position;
 		out vec3 v_Normal;
 		
 		void main() {
 			mat4 MvpMat = u_VpMatrix * u_ModelMatrix;
 			gl_Position = MvpMat * a_Position;
 			v_Position = u_ModelMatrix * a_Position;
 			mat4 nrmMat = inverse(transpose(u_ModelMatrix));
 			v_Normal = normalize(vec3(nrmMat * a_Normal));
 		}
 	`,this.FSHADER_SOURCE=`#version 300 es
 		precision highp float;
 		precision highp int;
 		
 		struct Light {
 			vec4 pos;
 			vec3 ambi;
 			vec3 diff;
 			vec3 spec;
 			bool attn;
 		};
 		
 		struct Matl {
 			vec3 emit;
 			vec3 ambi;
 			vec3 diff;
 			vec3 spec;
 			float shiny;
 		};
 		
 		in vec4 v_Position;
 		in vec3 v_Normal;
 		
 		uniform Light u_LampSet[2];
 		uniform Matl u_MatlSet[1];
 		
 		uniform vec4 u_eyePosWorld;
 		
 		out vec4 myOutputColor;
 		
 		void main() {
 			vec3 normal = v_Normal;
 			vec3 color = u_MatlSet[0].emit;
 			for (int i=0; i < 2; i++) {
 				vec3 to_light = u_LampSet[i].pos.xyz - v_Position.xyz;
 				vec3 lightDirection = normalize(to_light);
 				vec3 eyeDirection = normalize(u_eyePosWorld.xyz - v_Position.xyz);
 				float nDotL = max(dot(lightDirection, normal), 0.0);
 				vec3 R = normalize(-reflect(lightDirection, normal));
 				float e64 = pow(max(dot(R, eyeDirection), 0.0), u_MatlSet[0].shiny);
 				
 				float attenuation = 1.0;
 				if (u_LampSet[i].attn) {
 					float d = length(to_light);
 					attenuation /= d;
 				}
 				
 				vec3 ambient = u_LampSet[i].ambi * u_MatlSet[0].ambi;
 				vec3 diffuse = u_LampSet[i].diff * u_MatlSet[0].diff * nDotL;
 				vec3 speculr = u_LampSet[i].spec * u_MatlSet[0].spec * e64;
 				color += attenuation * (diffuse + speculr) + ambient;
 			}
 			myOutputColor = vec4(color, 1.0);
 		}
 	`,this.vboLoc,this.iboLoc,this.shaderLoc,this.vaoLoc,this.startEnd=[],this.vboContents,this.iboContents,this.modelMat=glMatrix.mat4.create(),this.u_VpMatrix,this.u_ModelMatrix,this.u_NormalMatrix,this.u_eyePosWorld,this.uLoc_Ke,this.uLoc_Ka,this.uLoc_Kd,this.uLoc_Ks,this.uLoc_Kshiny}PreVis.prototype.init=function(t){this.initBO(),this.initShader(t)},PreVis.prototype.initBO=function(){var t,a=[],i=[],e=a.length/8,o=generator.quadWNormals();for(this.startEnd.push(2*i.length),t=0;t<o.length;t++)a.push(o[t]);for(o=generator.quadInd(),t=0;t<o.length;t++)i.push(o[t]+e);this.startEnd.push(o.length),e=a.length/8;o=generator.sphere([0,0,0],1,36);for(this.startEnd.push(2*i.length),t=0;t<o.length;t++)a.push(o[t]);for(o=generator.sphereInd(36),t=0;t<o.length;t++)i.push(o[t]+e);this.startEnd.push(o.length),e=a.length/8;o=generator.cubeWNormals();for(this.startEnd.push(2*i.length),t=0;t<o.length;t++)a.push(o[t]);for(o=generator.cubeInd(),t=0;t<o.length;t++)i.push(o[t]+e);this.startEnd.push(o.length),e=a.length/8;o=generator.cylinWNormals(48);for(this.startEnd.push(2*i.length),t=0;t<o.length;t++)a.push(o[t]);for(o=generator.cylinInd(48),t=0;t<o.length;t++)i.push(o[t]+e);this.startEnd.push(o.length),e=a.length/8;o=generator.disc(32);for(this.startEnd.push(2*i.length),t=0;t<o.length;t++)a.push(o[t]);for(o=generator.discInd(32),t=0;t<o.length;t++)i.push(o[t]+e);this.startEnd.push(o.length),this.vboContents=new Float32Array(a),this.iboContents=new Uint16Array(i)},PreVis.prototype.initShader=function(t){if(this.shaderLoc=createProgram(t,this.VSHADER_SOURCE,this.FSHADER_SOURCE),this.shaderLoc){t.program=this.shaderLoc;var a=t.getAttribLocation(this.shaderLoc,"a_Position");if(a<0)return console.log(this.constructor.name+".init() Failed to get GPU location of attribute a_Position"),-1;var i=t.getAttribLocation(this.shaderLoc,"a_Normal");if(i<0)return console.log(this.constructor.name+".init() Failed to get GPU location of attribute a_Normal"),-1;this.u_VpMatrix=t.getUniformLocation(this.shaderLoc,"u_VpMatrix"),this.u_ModelMatrix=t.getUniformLocation(this.shaderLoc,"u_ModelMatrix"),this.u_eyePosWorld=t.getUniformLocation(this.shaderLoc,"u_eyePosWorld");for(var e=0;e<lamp.length;){var o="u_LampSet["+e+"]";if(lamp[e].u_pos=t.getUniformLocation(this.shaderLoc,o+".pos"),lamp[e].u_ambi=t.getUniformLocation(this.shaderLoc,o+".ambi"),lamp[e].u_diff=t.getUniformLocation(this.shaderLoc,o+".diff"),lamp[e].u_spec=t.getUniformLocation(this.shaderLoc,o+".spec"),lamp[e].u_attn=t.getUniformLocation(this.shaderLoc,o+".attn"),!(lamp[e].u_pos&&lamp[e].u_ambi&&lamp[e].u_diff&&lamp[e].u_spec&&lamp[e].u_attn))return void console.log("Failed to get GPUs Lamp0 storage locations");e++}o="u_MatlSet[0]";if(this.uLoc_Ke=t.getUniformLocation(this.shaderLoc,o+".emit"),this.uLoc_Ka=t.getUniformLocation(this.shaderLoc,o+".ambi"),this.uLoc_Kd=t.getUniformLocation(this.shaderLoc,o+".diff"),this.uLoc_Ks=t.getUniformLocation(this.shaderLoc,o+".spec"),this.uLoc_Kshiny=t.getUniformLocation(this.shaderLoc,o+".shiny"),!(this.uLoc_Ke&&this.uLoc_Ka&&this.uLoc_Kd&&this.uLoc_Ks&&this.uLoc_Kshiny))return console.log("Failed to get GPUs Reflectance storage locations:"),console.log("\temit = "+this.uLoc_Ke),console.log("\tambi = "+this.uLoc_Ka),console.log("\tdiff = "+this.uLoc_Kd),console.log("\tspec = "+this.uLoc_Ks),void console.log("\tshiny = "+this.uLoc_Kshiny);this.vaoLoc=t.createVertexArray(),t.bindVertexArray(this.vaoLoc),this.vboLoc=t.createBuffer(),this.vboLoc?(t.bindBuffer(t.ARRAY_BUFFER,this.vboLoc),t.bufferData(t.ARRAY_BUFFER,this.vboContents,t.STATIC_DRAW),this.iboLoc=t.createBuffer(),this.iboLoc?(t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,this.iboLoc),t.bufferData(t.ELEMENT_ARRAY_BUFFER,this.iboContents,t.STATIC_DRAW),this.vboContents,t.enableVertexAttribArray(a),t.vertexAttribPointer(a,4,t.FLOAT,!1,32,0),t.enableVertexAttribArray(i),t.vertexAttribPointer(i,4,t.FLOAT,!1,32,16),t.bindVertexArray(null)):console.log(this.constructor.name+".init() failed to create IBO in GPU. Bye!")):console.log(this.constructor.name+".init() failed to create VBO in GPU. Bye!")}else console.log(this.constructor.name+".init() failed to create executable Shaders on the GPU. Bye!")},PreVis.prototype.draw=function(){var t;for(gl.useProgram(this.shaderLoc),gl.bindVertexArray(this.vaoLoc),gl.uniformMatrix4fv(this.u_VpMatrix,!1,camera.vp),gl.uniform4fv(this.u_eyePosWorld,camera.eyePoint),t=0;t<lamp.length;t++)gl.uniform4fv(lamp[t].u_pos,lamp[t].I_pos),gl.uniform3fv(lamp[t].u_ambi,lamp[t].I_ambi),gl.uniform3fv(lamp[t].u_diff,lamp[t].I_diff),gl.uniform3fv(lamp[t].u_spec,lamp[t].I_spec),gl.uniform1f(lamp[t].u_attn,lamp[t].attn);switch(g_SceneNum){default:case 0:this.drawScene0();break;case 1:this.drawScene1();break;case 2:this.drawScene2();break;case 3:this.drawScene3()}gl.bindVertexArray(null)},PreVis.prototype.drawScene0=function(){glMatrix.mat4.copy(this.modelMat,idMat),this.getMatlUniforms(1),this.drawGround(),this.getMatlUniforms(3),glMatrix.mat4.translate(this.modelMat,idMat,[1,1,1.3]),glMatrix.mat4.rotate(this.modelMat,this.modelMat,.25*Math.PI,[1,0,0]),glMatrix.mat4.rotate(this.modelMat,this.modelMat,.25*Math.PI,[0,0,1]),glMatrix.mat4.scale(this.modelMat,this.modelMat,[2,2,2]),this.drawDisc(),this.getMatlUniforms(5),glMatrix.mat4.translate(this.modelMat,idMat,[-1,1,1.3]),glMatrix.mat4.rotate(this.modelMat,this.modelMat,-.25*Math.PI,[1,0,0]),glMatrix.mat4.rotate(this.modelMat,this.modelMat,Math.PI/3,[0,0,1]),glMatrix.mat4.scale(this.modelMat,this.modelMat,[2,2,2]),this.drawDisc(),this.getMatlUniforms(7),glMatrix.mat4.translate(this.modelMat,idMat,[1.2,-1,1]),this.drawSphere(),this.getMatlUniforms(6),glMatrix.mat4.translate(this.modelMat,idMat,[-4.5,-6,1]),this.drawSphere(),this.getMatlUniforms(3),glMatrix.mat4.translate(this.modelMat,idMat,[-4,-2,1.5]),glMatrix.mat4.rotate(this.modelMat,this.modelMat,.25*Math.PI,[0,1,0]),this.drawCube(),this.getMatlUniforms(4),glMatrix.mat4.translate(this.modelMat,idMat,[-.75,-2.5,1.7]),glMatrix.mat4.rotate(this.modelMat,this.modelMat,.6*Math.PI,[-.8,1,0]),this.drawCylinder()},PreVis.prototype.drawScene1=function(){glMatrix.mat4.copy(this.modelMat,idMat),this.getMatlUniforms(1),this.drawGround(),glMatrix.mat4.translate(this.modelMat,idMat,[-4,-1,2]),glMatrix.mat4.scale(this.modelMat,this.modelMat,[1,1,2]),this.getMatlUniforms(2),this.drawSphere(),glMatrix.mat4.translate(this.modelMat,idMat,[1,-3,.5]),glMatrix.mat4.rotate(this.modelMat,this.modelMat,-.25*Math.PI,[0,0,1]),glMatrix.mat4.scale(this.modelMat,this.modelMat,[1,2,.5]),this.drawSphere(),glMatrix.mat4.translate(this.modelMat,idMat,[2,2,1]),glMatrix.mat4.rotate(this.modelMat,this.modelMat,-.35*Math.PI,[0,0,1]),glMatrix.mat4.scale(this.modelMat,this.modelMat,[3,.75,1]),this.drawSphere(),glMatrix.mat4.translate(this.modelMat,idMat,[-3,5,1]),this.getMatlUniforms(3),this.drawCube(),glMatrix.mat4.translate(this.modelMat,idMat,[3,-6,1.5]),glMatrix.mat4.rotate(this.modelMat,this.modelMat,.4,[0,0,1]),glMatrix.mat4.scale(this.modelMat,this.modelMat,[1,1,1.5]),this.getMatlUniforms(4),this.drawCube(),glMatrix.mat4.translate(this.modelMat,idMat,[-2,0,.25]),glMatrix.mat4.rotate(this.modelMat,this.modelMat,.5*Math.PI,[1,-.25,0]),glMatrix.mat4.scale(this.modelMat,this.modelMat,[.25,.25,4]),this.getMatlUniforms(5),this.drawCylinder(),glMatrix.mat4.translate(this.modelMat,idMat,[-.5,5,0]),glMatrix.mat4.scale(this.modelMat,this.modelMat,[1,.25,1.5]),this.getMatlUniforms(6),this.drawCylinder()},PreVis.prototype.drawScene2=function(){glMatrix.mat4.copy(this.modelMat,idMat),this.getMatlUniforms(1),this.drawGround(),glMatrix.mat4.translate(this.modelMat,idMat,[0,0,1.25]),glMatrix.mat4.scale(this.modelMat,this.modelMat,[1.25,1.25,1.25]),this.getMatlUniforms(3),this.drawSphere(),glMatrix.mat4.translate(this.modelMat,idMat,[5,0,1]),this.getMatlUniforms(2),this.drawSphere(),glMatrix.mat4.translate(this.modelMat,idMat,[-5,0,1]),this.drawSphere(),glMatrix.mat4.translate(this.modelMat,idMat,[0,5,1]),this.drawSphere(),glMatrix.mat4.translate(this.modelMat,idMat,[0,-5,1]),this.drawSphere(),glMatrix.mat4.translate(this.modelMat,idMat,[6,-6,1.25]),glMatrix.mat4.scale(this.modelMat,this.modelMat,[.5,.5,1.25]),this.getMatlUniforms(1),this.drawCube(),glMatrix.mat4.translate(this.modelMat,idMat,[-6,6,1.25]),glMatrix.mat4.scale(this.modelMat,this.modelMat,[.5,.5,1.25]),this.drawCube(),glMatrix.mat4.translate(this.modelMat,idMat,[-6,-6,.75]),glMatrix.mat4.scale(this.modelMat,this.modelMat,[.5,.5,.75]),this.getMatlUniforms(0),this.drawCube(),glMatrix.mat4.translate(this.modelMat,idMat,[6,6,.75]),glMatrix.mat4.scale(this.modelMat,this.modelMat,[.5,.5,.75]),this.drawCube()},PreVis.prototype.drawScene3=function(){glMatrix.mat4.copy(this.modelMat,idMat),this.getMatlUniforms(1),this.drawGround(),glMatrix.mat4.translate(this.modelMat,idMat,[0,0,1]),this.getMatlUniforms(6),this.drawCube(),glMatrix.mat4.translate(this.modelMat,idMat,[0,0,2]),glMatrix.mat4.scale(this.modelMat,this.modelMat,[.25,.25,2]),this.getMatlUniforms(3),this.drawCylinder(),glMatrix.mat4.translate(this.modelMat,idMat,[0,0,4]),glMatrix.mat4.scale(this.modelMat,this.modelMat,[.5,.5,.5]),this.getMatlUniforms(4),this.drawSphere(),glMatrix.mat4.translate(this.modelMat,idMat,[0,0,4]),glMatrix.mat4.rotate(this.modelMat,this.modelMat,.25*Math.PI,[1,0,0]),glMatrix.mat4.scale(this.modelMat,this.modelMat,[.15,.15,2]),this.getMatlUniforms(5),this.drawCylinder(),glMatrix.mat4.translate(this.modelMat,idMat,[0,-1.5,5.5]),glMatrix.mat4.scale(this.modelMat,this.modelMat,[.75,.75,.75]),this.getMatlUniforms(2),this.drawSphere(),glMatrix.mat4.translate(this.modelMat,idMat,[0,-1.5,5.5]),glMatrix.mat4.rotate(this.modelMat,this.modelMat,.5*Math.PI,[1,0,0]),glMatrix.mat4.scale(this.modelMat,this.modelMat,[.15,.15,3]),this.getMatlUniforms(7),this.drawCylinder(),glMatrix.mat4.translate(this.modelMat,idMat,[0,-4.5,5.5]),glMatrix.mat4.scale(this.modelMat,this.modelMat,[.25,.75,1]),this.getMatlUniforms(8),this.drawSphere()},PreVis.prototype.getMatlUniforms=function(t){gl.uniform3fv(this.uLoc_Ke,matter[t].K_emit.slice(0,3)),gl.uniform3fv(this.uLoc_Ka,matter[t].K_ambi.slice(0,3)),gl.uniform3fv(this.uLoc_Kd,matter[t].K_diff.slice(0,3)),gl.uniform3fv(this.uLoc_Ks,matter[t].K_spec.slice(0,3)),gl.uniform1f(this.uLoc_Kshiny,matter[t].K_shiny)},PreVis.prototype.drawGround=function(){glMatrix.mat4.translate(this.modelMat,idMat,[0,0,0]),glMatrix.mat4.scale(this.modelMat,this.modelMat,[1e5,1e5,1e5]),this.drawQuad()},PreVis.prototype.drawDisc=function(){gl.uniformMatrix4fv(this.u_ModelMatrix,!1,this.modelMat),gl.drawElements(gl.TRIANGLES,this.startEnd[9],gl.UNSIGNED_SHORT,this.startEnd[8]),glMatrix.mat4.rotate(this.modelMat,this.modelMat,Math.PI,[1,0,0]),gl.uniformMatrix4fv(this.u_ModelMatrix,!1,this.modelMat),gl.drawElements(gl.TRIANGLES,this.startEnd[9],gl.UNSIGNED_SHORT,this.startEnd[8])},PreVis.prototype.drawCube=function(){gl.uniformMatrix4fv(this.u_ModelMatrix,!1,this.modelMat),gl.drawElements(gl.TRIANGLES,this.startEnd[5],gl.UNSIGNED_SHORT,this.startEnd[4])},PreVis.prototype.drawSphere=function(){gl.uniformMatrix4fv(this.u_ModelMatrix,!1,this.modelMat),gl.drawElements(gl.TRIANGLES,this.startEnd[3],gl.UNSIGNED_SHORT,this.startEnd[2])},PreVis.prototype.drawQuad=function(){gl.uniformMatrix4fv(this.u_ModelMatrix,!1,this.modelMat),gl.drawElements(gl.TRIANGLES,this.startEnd[1],gl.UNSIGNED_SHORT,this.startEnd[0]),glMatrix.mat4.rotate(this.modelMat,this.modelMat,Math.PI,[1,0,0]),gl.uniformMatrix4fv(this.u_ModelMatrix,!1,this.modelMat),gl.drawElements(gl.TRIANGLES,this.startEnd[1],gl.UNSIGNED_SHORT,this.startEnd[0])},PreVis.prototype.drawCylinder=function(){gl.uniformMatrix4fv(this.u_ModelMatrix,!1,this.modelMat),gl.drawElements(gl.TRIANGLES,this.startEnd[7],gl.UNSIGNED_SHORT,this.startEnd[6])};