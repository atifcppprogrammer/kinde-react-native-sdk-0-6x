Object.defineProperty(exports,"__esModule",{value:true});exports.UserProfileV2FromJSON=UserProfileV2FromJSON;exports.UserProfileV2FromJSONTyped=UserProfileV2FromJSONTyped;exports.UserProfileV2ToJSON=UserProfileV2ToJSON;exports.instanceOfUserProfileV2=instanceOfUserProfileV2;var _ApiClient=require("../ApiClient");function instanceOfUserProfileV2(value){var isInstance=true;return isInstance;}function UserProfileV2FromJSON(json){return UserProfileV2FromJSONTyped(json,false);}function UserProfileV2FromJSONTyped(json,ignoreDiscriminator){if(json===undefined||json===null){return json;}return{id:!(0,_ApiClient.exists)(json,'id')?undefined:json['id'],providedId:!(0,_ApiClient.exists)(json,'provided_id')?undefined:json['provided_id'],name:!(0,_ApiClient.exists)(json,'name')?undefined:json['name'],givenName:!(0,_ApiClient.exists)(json,'given_name')?undefined:json['given_name'],familyName:!(0,_ApiClient.exists)(json,'family_name')?undefined:json['family_name'],updatedAt:!(0,_ApiClient.exists)(json,'updated_at')?undefined:json['updated_at']};}function UserProfileV2ToJSON(value){if(value===undefined){return undefined;}if(value===null){return null;}return{id:value.id,provided_id:value.providedId,name:value.name,given_name:value.givenName,family_name:value.familyName,updated_at:value.updatedAt};}