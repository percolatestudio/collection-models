/**
 *
 * Collection Models - a simple mechanism to add instance methods
 *   to the documents passed out of Collections.
 *
 *
 * Basic usage: 
 *   var Post = CollectionModel.extend({
 *     slug: function() { 
 *       return slugify(this.title);
 *     }
 *   });
 *
 *   Posts = new Meteor.Collection('posts', Post.getTransformOptions());
 *
 *
 * We could do something like:
 *
 *   // this is a method added to CollectionModel by the 
 *   // collection-model-schema package
 *   Post.setSchema({ 
 *     title: String
 *   });
 *
 * which gives:
 *
 *   Post.prototype.isValid, etc
 *
 * Then we could do something like:
 *
 *   Posts.validateClientWrites() -- which would work because the 
 *     transformed posts that appear in allow/deny would have isValid()
 *     and friends, but wouldn't mean you _had_ to use the 
 *     schema package (you could write your own isValid() if you wanted).
 *
 */

CollectionModel = function(doc) {
  _.extend(this, doc);
}

// XXX: deal with further inheritance?
CollectionModel.extend = function(fns) {
  var model = function(doc) { 
    CollectionModel.call(this, doc);
  }
  model.prototype = Object.create(CollectionModel.prototype)

  // instance methods
  _.extend(model.prototype, fns);
  
  // this is what CS does to copy class methods (I think)
  // I guess it's OK as it only happens once
  _.extend(model, CollectionModel)
  
  return model;
}

CollectionModel.getTransform = function() {
  var model = this;
  return function(doc) { return new model(doc); }
}

CollectionModel.getTransformOptions = function() {
  return {transform: this.getTransform()};
}

// Util functions that are useful for collection models

/**
 *
 * makeCursor
 *
 *   - takes a function(where, options) and returns
 *   a function that's appropriate to be called from handlebars
 *
 *   e.g.
 *     Posts.recent = CollectionModel.makeCursor(function(where, options) {
 *       options.sort = {createdAt: -1}
 *       options.limit = options.limit || 10;
 *
 *       return Posts.find(where, options);
 *     });
 *
 *  Can then be used like so
 *
 *  {{ recentPosts authorId=_id }}
 *
 *  Template.X.recentPosts = Posts.recent
 *
 *
 *  XXX: downsides of this approach 
 *   - you can't set both where and options via the hash
 *   - you can't do a where on a field called 'hash'
 *   - everything may change in UI
 */

CollectionModel.makeCursor = function(fn) {
  return function(where, options) {
    where = where || {};
    options = options || {};
    
    if (where instanceof Spacebars.kw)
      where = where.hash;

    if (options instanceof Spacebars.kw)
      options = options.kw
    
    return fn.call(this, where, options);
  }
}


/**
 *
 * XXX: TODO
 *
 */

// var findCollection = function(name) {
//   // ensure it's capitalized
//   name[0] = name[0].toUpperCase();
//   
//   var global = (typeof window !== 'undefined') ? window : global;
// }
// 
// // XXX: you should be able to pass in the collection
// CollectionModel.hasMany = function(name) {
//   var collection = findCollection(name);
//   
//   this.prototype[name] = this.makeCursor(function(where, options) {
//     // XXX: how to get the name of the foreign key?
//     where
//     
//     return Collection
//   });
// };

// CollectionModel.hasOne = function() {};
// CollectionModel.belongsTo = function() {};
