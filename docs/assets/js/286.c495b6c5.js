"use strict";(self.webpackChunkunicom=self.webpackChunkunicom||[]).push([[286],{5286:(t,e,a)=>{a.r(e),a.d(e,{default:()=>tt});var r=a(7294),n=a(3906),o=a(4680),i=a(9062),s=a(2658),l=a(2642),u=a(6585),c=a(9708),m=a(3516),d=a(6867),h=a(2288),p=a(2981),f=a(1023),g=a(5116),v=a(270),E=a(8201),b=a(558),y=a(9469),Z=a(2961),I=a(2450),C=a(6446),P=a(3709),S=a(476),F=a(542),A=a(2852),w=a(6694),x=a(6818),L=a(7109),j=a(1733),U=a(4970),k=a(1586),O=a(7665),T=a(6036),N=a(3797),B=a(891),D=a(842),W=a(6536),M=a(4007),J=a(7484),R=a.n(J),_=a(310),q=a(9250),z=a(9655);function G(t){return G="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},G(t)}function H(t,e){(null==e||e>t.length)&&(e=t.length);for(var a=0,r=new Array(e);a<e;a++)r[a]=t[a];return r}function V(){return V=Object.assign?Object.assign.bind():function(t){for(var e=1;e<arguments.length;e++){var a=arguments[e];for(var r in a)Object.prototype.hasOwnProperty.call(a,r)&&(t[r]=a[r])}return t},V.apply(this,arguments)}function $(t,e){for(var a=0;a<e.length;a++){var r=e[a];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,(void 0,n=function(t,e){if("object"!==G(t)||null===t)return t;var a=t[Symbol.toPrimitive];if(void 0!==a){var r=a.call(t,"string");if("object"!==G(r))return r;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(t)}(r.key),"symbol"===G(n)?n:String(n)),r)}var n}function K(t,e){return K=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(t,e){return t.__proto__=e,t},K(t,e)}function Q(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}function X(t){return X=Object.setPrototypeOf?Object.getPrototypeOf.bind():function(t){return t.__proto__||Object.getPrototypeOf(t)},X(t)}var Y=function(t){!function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),Object.defineProperty(t,"prototype",{writable:!1}),e&&K(t,e)}(H,t);var e,a,J,q,z=(J=H,q=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(t){return!1}}(),function(){var t,e=X(J);if(q){var a=X(this).constructor;t=Reflect.construct(e,arguments,a)}else t=e.apply(this,arguments);return function(t,e){if(e&&("object"===G(e)||"function"==typeof e))return e;if(void 0!==e)throw new TypeError("Derived constructors may only return object or undefined");return Q(t)}(this,t)});function H(t){var e;return function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,H),(e=z.call(this,t)).state={createMode:!0,usuario:null,papelList:null,papelByPapelId:null,cargoList:null,cargoByCargoId:null,contratoList:null,contratoByContratoId:null,departamentoList:null,departamentoByDepartamentoId:null,jornadaList:null,jornadaByJornadaId:null,usuarioId:"",nome:"",email:"",matricula:"",senha:"",confirmaSenha:"",ativo:!0,papelIdList:[],dataNascimento:null,cpf:"",telefoneCelular:"",whatsapp:"",dataContratacao:null,cargoId:null,contratoId:null,departamentoId:null,jornadaId:null,showSenha:!1,saving:!1,savingFotoPerfil:!1,deletingFotoPerfil:!1,calling:!1,alertOpen:!1,alert:null,errors:{}},e.getUsuarioFromApi=e.getUsuarioFromApi.bind(Q(e)),e.getPapelListFromApi=e.getPapelListFromApi.bind(Q(e)),e.getCargoListFromApi=e.getCargoListFromApi.bind(Q(e)),e.getContratoListFromApi=e.getContratoListFromApi.bind(Q(e)),e.getDepartamentoListFromApi=e.getDepartamentoListFromApi.bind(Q(e)),e.getJornadaListFromApi=e.getJornadaListFromApi.bind(Q(e)),e.saveUsuario=e.saveUsuario.bind(Q(e)),e.patchUsuario=e.patchUsuario.bind(Q(e)),e.postUsuario=e.postUsuario.bind(Q(e)),e.setUsuarioIdFromParams=e.setUsuarioIdFromParams.bind(Q(e)),e.deleteUsuarioFotoPerfil=e.deleteUsuarioFotoPerfil.bind(Q(e)),e.handleUsuarioFotoChange=e.handleUsuarioFotoChange.bind(Q(e)),e.openAlert=e.openAlert.bind(Q(e)),e.closeAlert=e.closeAlert.bind(Q(e)),e}return e=H,(a=[{key:"componentDidMount",value:function(){this.setUsuarioIdFromParams(),this.getPapelListFromApi(),this.getCargoListFromApi(),this.getContratoListFromApi(),this.getDepartamentoListFromApi(),this.getJornadaListFromApi(),null!==this.props.searchParams.get("novo")&&this.openAlert("success","Usuário criado com sucesso!")}},{key:"setUsuarioIdFromParams",value:function(){var t=this,e=parseInt(this.props.params.usuarioId);isNaN(e)?this.setState({createMode:!0}):this.setState({createMode:!1,usuarioId:e},(function(){return t.getUsuarioFromApi()}))}},{key:"getUsuarioFromApi",value:function(){var t=this;this.setState({calling:!0}),_.Z.get("/usuario/"+this.state.usuarioId).then((function(e){var a=e.data;t.setState({usuario:a,nome:a.nome,email:a.email,matricula:a.matricula,ativo:a.ativo,papelIdList:a.papelList.map((function(t){return t.papelId})),errors:{},senha:"",confirmaSenha:"",dataNascimento:a.dataNascimento,cpf:null!==a.cpf?a.cpf:"",telefoneCelular:null!==a.telefoneCelular?a.telefoneCelular:"",whatsapp:null!==a.whatsapp?a.whatsapp:"",dataContratacao:a.dataContratacao,cargoId:a.cargoId,contratoId:a.contratoId,departamentoId:a.departamentoId,jornadaId:a.jornadaId,calling:!1})})).catch((function(e){console.log(e),setTimeout(t.getUsuarioFromApi,3e3)}))}},{key:"getPapelListFromApi",value:function(){var t=this;_.Z.get("/empresa/me/papel").then((function(e){var a=e.data,r={};a.forEach((function(t){return r[t.papelId]=t})),t.setState({papelList:a,papelByPapelId:r})})).catch((function(e){console.log(e),setTimeout(t.getPapelListFromApi,3e3)}))}},{key:"getCargoListFromApi",value:function(){var t=this;_.Z.get("/empresa/me/cargo").then((function(e){var a=e.data,r={};a.forEach((function(t){return r[t.cargoId]=t})),t.setState({cargoList:a,cargoByCargoId:r})})).catch((function(e){console.log(e),setTimeout(t.getCargoListFromApi,3e3)}))}},{key:"getContratoListFromApi",value:function(){var t=this;_.Z.get("/empresa/me/contrato").then((function(e){var a=e.data,r={};a.forEach((function(t){return r[t.contratoId]=t})),t.setState({contratoList:a,contratoByContratoId:r})})).catch((function(e){console.log(e),setTimeout(t.getContratoListFromApi,3e3)}))}},{key:"getDepartamentoListFromApi",value:function(){var t=this;_.Z.get("/empresa/me/departamento").then((function(e){var a=e.data,r={};a.forEach((function(t){return r[t.departamentoId]=t})),t.setState({departamentoList:a,departamentoByDepartamentoId:r})})).catch((function(e){console.log(e),setTimeout(t.getDepartamentoListFromApi,3e3)}))}},{key:"getJornadaListFromApi",value:function(){var t=this;_.Z.get("/empresa/me/jornada").then((function(e){var a=e.data,r={};a.forEach((function(t){return r[t.jornadaId]=t})),t.setState({jornadaList:a,jornadaByJornadaId:r})})).catch((function(e){console.log(e),setTimeout(t.getJornadaListFromApi,3e3)}))}},{key:"openAlert",value:function(t,e){this.setState({alert:r.createElement(h.Z,{severity:t,onClose:this.closeAlert},e),alertOpen:!0})}},{key:"closeAlert",value:function(){this.setState({alertOpen:!1})}},{key:"postUsuario",value:function(t){var e=this;this.setState({calling:!0,saving:!0}),_.Z.post("/usuario/",t).then((function(t){e.props.navigate("/usuarios/"+t.data.usuarioId+"?novo")})).catch((function(t){var a={};"response"in t&&"errors"in t.response.data?(a=t.response.data.errors,e.openAlert("error","Falha ao criar usuário!")):e.openAlert("error","Erro inesperado"),e.setState({calling:!1,saving:!1,errors:a})}))}},{key:"patchUsuario",value:function(t){var e=this;this.setState({calling:!0,saving:!0}),_.Z.patch("/usuario/".concat(this.state.usuarioId),t).then((function(t){e.openAlert("success","Usuário salvo com sucesso!"),e.getUsuarioFromApi(),e.setState({calling:!1,saving:!1,errors:{}})})).catch((function(t){var a={};"response"in t&&"errors"in t.response.data?(a=t.response.data.errors,e.openAlert("error","Falha ao salvar usuário!")):e.openAlert("error","Erro inesperado"),e.setState({calling:!1,saving:!1,errors:a})}))}},{key:"saveUsuario",value:function(){var t={nome:this.state.nome,email:this.state.email,matricula:this.state.matricula,ativo:this.state.ativo,papelIdList:this.state.papelIdList,dataNascimento:this.state.dataNascimento,cpf:""!=this.state.cpf?this.state.cpf:null,telefoneCelular:""!=this.state.telefoneCelular?this.state.telefoneCelular:null,whatsapp:""!=this.state.whatsapp?this.state.whatsapp:null,dataContratacao:this.state.dataContratacao,cargoId:this.state.cargoId,contratoId:this.state.contratoId,departamentoId:this.state.departamentoId,jornadaId:this.state.jornadaId};if(""!=this.state.senha){if(this.state.senha!=this.state.confirmaSenha)return void this.setState({errors:{senha:"as senhas não conferem",confirmaSenha:""}});t.senha=this.state.senha}this.state.createMode?this.postUsuario(t):this.patchUsuario(t)}},{key:"deleteUsuarioFotoPerfil",value:function(){var t=this;this.setState({calling:!0,deletingUsuarioFotoPerfil:!0}),_.Z.delete("/usuario/".concat(this.state.usuario.usuarioId,"/foto-perfil")).then((function(e){t.openAlert("success","Foto deletada com sucesso!"),t.getUsuarioFromApi(),t.setState({calling:!1,deletingUsuarioFotoPerfil:!1,errors:{}})})).catch((function(e){t.openAlert("error","Falha ao deletar foto!"),t.setState({calling:!1,deletingUsuarioFotoPerfil:!1,errors:{}})}))}},{key:"handleUsuarioFotoChange",value:function(t){var e=this;this.setState({calling:!0,savingFotoPerfil:!0});var a=new FormData;a.append("file",t.target.files[0]),_.Z.post("/usuario/".concat(this.state.usuario.usuarioId,"/foto-perfil"),a,{headers:{"content-type":"multipart/form-data"}}).then((function(t){e.openAlert("success","Foto salva com sucesso!"),e.getUsuarioFromApi(),e.setState({calling:!1,savingFotoPerfil:!1,errors:{}})})).catch((function(t){e.openAlert("error","Falha ao salvar foto!"),e.setState({calling:!1,savingFotoPerfil:!1,errors:{}})})),t.target.value=""}},{key:"render",value:function(){var t=this;return r.createElement(r.Fragment,null,r.createElement(o.Z,{elevation:3,sx:{flexGrow:1,padding:5,minHeight:"100%",minWidth:"800px",boxSizing:"border-box",display:"flex",flexDirection:"column",aligmItems:"center",justifyContent:"start"},className:"modulePaper"},r.createElement(s.Z,{variant:"h3",gutterBottom:!0},this.state.createMode?"Novo Usuário":"Editar Usuário"),r.createElement(u.Z,{sx:{marginBottom:3}},r.createElement(l.Z,{variant:"outlined",size:"large",startIcon:r.createElement(f.Z,null),onClick:function(){return t.props.navigate(-1)}},"Voltar"),r.createElement(m.Z,{variant:"contained",size:"large",startIcon:r.createElement(x.Z,null),loadingPosition:"start",loading:this.state.saving,disabled:this.state.calling,onClick:this.saveUsuario},"Salvar")),r.createElement(n.Z,{sx:{flexGrow:1}},!this.state.createMode&&null==this.state.usuario||null==this.state.papelList||null==this.state.cargoList||null==this.state.contratoList||null==this.state.departamentoList||null==this.state.jornadaList?r.createElement(n.Z,{width:"100%",display:"flex",justifyContent:"center",m:3},r.createElement(i.Z,null)):r.createElement(b.ZP,{container:!0,spacing:3,sx:{margin:0}},r.createElement(b.ZP,{item:!0,xs:!0},r.createElement(c.Z,{gap:1,justifyContent:"center",alignItems:"center"},this.state.createMode?r.createElement(L.Z,{variant:"square",sx:{width:"128px",height:"128px"}},this.state.nome.charAt(0)):r.createElement(r.Fragment,null,r.createElement(L.Z,{variant:"square",sx:{width:"128px",height:"128px"},src:this.state.usuario.fotoPerfil?_.Z.defaults.baseURL+"/usuario/"+this.state.usuario.usuarioId+"/foto-perfil?versao="+this.state.usuario.fotoPerfilVersao:""},this.state.nome.charAt(0)),r.createElement(m.Z,{component:"label",variant:"contained",sx:{width:"128px"},startIcon:r.createElement(U.Z,null),loadingPosition:"start",loading:this.state.savingFotoPerfil,disabled:this.state.calling},"Upload",r.createElement("input",{type:"file",accept:"image/jpeg",id:"foto-perfil",hidden:!0,onChange:this.handleUsuarioFotoChange})),this.state.usuario.fotoPerfil?r.createElement(m.Z,{variant:"contained",sx:{width:"128px"},startIcon:r.createElement(j.Z,null),color:"error",loadingPosition:"start",loading:this.state.deletingFotoPerfil,onClick:this.deleteUsuarioFotoPerfil},"Remover"):""))),r.createElement(b.ZP,{item:!0,xs:11},r.createElement("form",{onSubmit:function(t){return t.preventDefault()},disabled:this.state.createMode&&null==this.state.usuario},r.createElement(b.ZP,{container:!0,spacing:3},r.createElement(b.ZP,{item:!0,xs:6},r.createElement(g.Z,{id:"nome",value:this.state.nome,onChange:function(e){return t.setState({nome:e.target.value})},fullWidth:!0,label:"Nome",required:!0,InputProps:{startAdornment:r.createElement(v.Z,{position:"start"},r.createElement(E.Z,null))},variant:"outlined",disabled:this.state.calling,error:"nome"in this.state.errors,helperText:"nome"in this.state.errors?this.state.errors.nome:""})),r.createElement(b.ZP,{item:!0,xs:6},r.createElement(g.Z,{id:"email",value:this.state.email,onChange:function(e){return t.setState({email:e.target.value})},fullWidth:!0,label:"Email",required:!0,InputProps:{startAdornment:r.createElement(v.Z,{position:"start"},r.createElement(B.Z,null))},variant:"outlined",disabled:this.state.calling,error:"email"in this.state.errors,helperText:"email"in this.state.errors?this.state.errors.email:""})),r.createElement(b.ZP,{item:!0,xs:6},null!=this.state.papelList?r.createElement(w.Z,{multiple:!0,id:"papel-list",options:Object.keys(this.state.papelByPapelId).map((function(t){return parseInt(t)})),getOptionLabel:function(e){return t.state.papelByPapelId[e].nome},value:this.state.papelIdList,onChange:function(e,a){return t.setState({papelIdList:a})},renderInput:function(t){return r.createElement(g.Z,V({},t,{variant:"outlined",label:"Papéis"}))}}):null),r.createElement(b.ZP,{item:!0,xs:6},r.createElement(g.Z,{id:"matricula",value:this.state.matricula,onChange:function(e){return t.setState({matricula:e.target.value})},fullWidth:!0,label:"Matrícula",InputProps:{startAdornment:r.createElement(v.Z,{position:"start"},r.createElement(D.Z,null))},variant:"outlined",disabled:this.state.calling,error:"matricula"in this.state.errors,helperText:"matricula"in this.state.errors?this.state.errors.matricula:""})),r.createElement(b.ZP,{item:!0,xs:4},r.createElement(g.Z,{id:"cpf",value:this.state.cpf,onChange:function(e){return t.setState({cpf:e.target.value})},fullWidth:!0,label:"CPF",InputProps:{startAdornment:r.createElement(v.Z,{position:"start"},r.createElement(E.Z,null))},variant:"outlined",disabled:this.state.calling,error:"cpf"in this.state.errors,helperText:"cpf"in this.state.errors?this.state.errors.cpf:""})),r.createElement(b.ZP,{item:!0,xs:4},r.createElement(g.Z,{id:"telefone-celular",value:this.state.telefoneCelular,onChange:function(e){return t.setState({telefoneCelular:e.target.value})},fullWidth:!0,label:"Telefone Celular",InputProps:{startAdornment:r.createElement(v.Z,{position:"start"},r.createElement(W.Z,null))},variant:"outlined",disabled:this.state.calling,error:"telefoneCelular"in this.state.errors,helperText:"telefoneCelular"in this.state.errors?this.state.errors.telefoneCelular:""})),r.createElement(b.ZP,{item:!0,xs:4},r.createElement(g.Z,{id:"whatsapp",value:this.state.whatsapp,onChange:function(e){return t.setState({whatsapp:e.target.value})},fullWidth:!0,label:"Whatsapp",InputProps:{startAdornment:r.createElement(v.Z,{position:"start"},r.createElement(M.Z,null))},variant:"outlined",disabled:this.state.calling,error:"whatsapp"in this.state.errors,helperText:"whatsapp"in this.state.errors?this.state.errors.whatsapp:""})),r.createElement(b.ZP,{item:!0,xs:6},r.createElement(k.M,{id:"data-nascimento",value:null!==this.state.dataNascimento?R()(this.state.dataNascimento):null,onChange:function(e){return t.setState({dataNascimento:e})},label:"Data de Nascimento",slotProps:{field:{clearable:!0},textField:{fullWidth:!0,error:"dataNascimento"in this.state.errors,helperText:"dataNascimento"in this.state.errors?this.state.errors.dataNascimento:""}},disableFuture:!0,variant:"outlined",disabled:this.state.calling})),r.createElement(b.ZP,{item:!0,xs:6},r.createElement(k.M,{id:"data-contratacao",value:null!==this.state.dataContratacao?R()(this.state.dataContratacao):null,onChange:function(e){return t.setState({dataContratacao:e})},label:"Data Contratação",slotProps:{field:{clearable:!0},textField:{fullWidth:!0,error:"dataContratacao"in this.state.errors,helperText:"dataContratacao"in this.state.errors?this.state.errors.dataContratacao:""}},disableFuture:!0,variant:"outlined",disabled:this.state.calling})),r.createElement(b.ZP,{item:!0,xs:3},r.createElement(C.Z,{fullWidth:!0},r.createElement(O.Z,null,"Departamento"),r.createElement(T.Z,{id:"departamento",value:this.state.departamentoId,label:"Departamento",onChange:function(e){return t.setState({departamentoId:e.target.value})}},r.createElement(N.Z,{key:"nenhum",value:null},"Nenhum"),this.state.departamentoList.map((function(t){return r.createElement(N.Z,{key:t.departamentoId,value:t.departamentoId},t.nome)}))))),r.createElement(b.ZP,{item:!0,xs:3},r.createElement(C.Z,{fullWidth:!0},r.createElement(O.Z,null,"Cargo"),r.createElement(T.Z,{id:"cargo",value:this.state.cargoId,label:"Cargo",onChange:function(e){return t.setState({cargoId:e.target.value})}},r.createElement(N.Z,{key:"nenhum",value:null},"Nenhum"),this.state.cargoList.map((function(t){return r.createElement(N.Z,{key:t.cargoId,value:t.cargoId},t.nome)}))))),r.createElement(b.ZP,{item:!0,xs:3},r.createElement(C.Z,{fullWidth:!0},r.createElement(O.Z,null,"Contrato"),r.createElement(T.Z,{id:"contrato",value:this.state.contratoId,label:"Contrato",onChange:function(e){return t.setState({contratoId:e.target.value})}},r.createElement(N.Z,{key:"nenhum",value:null},"Nenhum"),this.state.contratoList.map((function(t){return r.createElement(N.Z,{key:t.contratoId,value:t.contratoId},t.nome)}))))),r.createElement(b.ZP,{item:!0,xs:3},r.createElement(C.Z,{fullWidth:!0},r.createElement(O.Z,null,"Jornada"),r.createElement(T.Z,{id:"jornada",value:this.state.jornadaId,label:"Jornada",onChange:function(e){return t.setState({jornadaId:e.target.value})}},r.createElement(N.Z,{key:"nenhum",value:null},"Nenhum"),this.state.jornadaList.map((function(t){return r.createElement(N.Z,{key:t.jornadaId,value:t.jornadaId},"".concat(t.entrada.substr(0,5)," - ").concat(t.intervaloInicio.substr(0,5)," - ").concat(t.intervaloFim.substr(0,5)," - ").concat(t.saida.substr(0,5)))}))))),r.createElement(b.ZP,{item:!0,xs:4},r.createElement(g.Z,{id:"senha",value:this.state.senha,type:this.state.showSenha?"text":"password",onChange:function(e){return t.setState({senha:e.target.value})},fullWidth:!0,label:"Senha",InputProps:{startAdornment:r.createElement(v.Z,{position:"start"},r.createElement(y.Z,null)),endAdornment:r.createElement(v.Z,{position:"end"},r.createElement(d.Z,{"aria-label":"toggle password visibility",onClick:function(){return t.setState({showSenha:!t.state.showSenha})},edge:"end"},this.state.showSenha?r.createElement(I.Z,null):r.createElement(Z.Z,null))),autoComplete:"new-password"},variant:"outlined",disabled:this.state.calling,error:"senha"in this.state.errors,helperText:"senha"in this.state.errors?this.state.errors.senha:""})),r.createElement(b.ZP,{item:!0,xs:4},r.createElement(g.Z,{id:"confirma-senha",value:this.state.confirmaSenha,type:this.state.showSenha?"text":"password",onChange:function(e){return t.setState({confirmaSenha:e.target.value})},fullWidth:!0,label:"Confirmar Senha",InputProps:{startAdornment:r.createElement(v.Z,{position:"start"},r.createElement(y.Z,null)),endAdornment:r.createElement(v.Z,{position:"end"},r.createElement(d.Z,{"aria-label":"toggle password visibility",onClick:function(){return t.setState({showSenha:!t.state.showSenha})},edge:"end"},this.state.showSenha?r.createElement(I.Z,null):r.createElement(Z.Z,null))),autoComplete:"new-password"},variant:"outlined",disabled:this.state.calling,error:"confirmaSenha"in this.state.errors,helperText:"confirmaSenha"in this.state.errors?this.state.errors.confirmaSenha:""})),r.createElement(b.ZP,{item:!0,xs:4},r.createElement(C.Z,{component:"fieldset",variant:"standard"},r.createElement(S.Z,{component:"legend"},"Ativo"),r.createElement(P.Z,null,r.createElement(F.Z,{control:r.createElement(A.Z,{checked:this.state.ativo,onChange:function(e){return t.setState({ativo:e.target.checked})}})}))))))))),r.createElement(p.Z,{in:this.state.alertOpen},this.state.alert)))}}])&&$(e.prototype,a),Object.defineProperty(e,"prototype",{writable:!1}),H}(r.Component);const tt=function(t){var e,a,n=(0,q.UO)(),o=(0,q.TH)(),i=(0,q.s0)(),s=(e=(0,z.lr)(),a=1,function(t){if(Array.isArray(t))return t}(e)||function(t,e){var a=null==t?null:"undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(null!=a){var r,n,o,i,s=[],l=!0,u=!1;try{if(o=(a=a.call(t)).next,0===e){if(Object(a)!==a)return;l=!1}else for(;!(l=(r=o.call(a)).done)&&(s.push(r.value),s.length!==e);l=!0);}catch(t){u=!0,n=t}finally{try{if(!l&&null!=a.return&&(i=a.return(),Object(i)!==i))return}finally{if(u)throw n}}return s}}(e,a)||function(t,e){if(t){if("string"==typeof t)return H(t,e);var a=Object.prototype.toString.call(t).slice(8,-1);return"Object"===a&&t.constructor&&(a=t.constructor.name),"Map"===a||"Set"===a?Array.from(t):"Arguments"===a||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(a)?H(t,e):void 0}}(e,a)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}())[0];return r.createElement(Y,V({params:n,location:o,navigate:i,searchParams:s},t))}}}]);