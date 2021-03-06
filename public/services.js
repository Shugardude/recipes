angular.module('RecipeApp')
	.service('GroceryService', function($rootScope, $http){
		var currentList;

		this.set = function(){
			return $http.get("/data/current").success(function(data){
			  console.log("Current Recipe", data)
		  	currentList = data;
		  });
		};
		
		this.add = function(recipe){
			var o = recipe.ingredients;
			for (var k in o){
				if (currentList[k]){
					var newQty = (parseInt(currentList[k].qty) + parseInt(o[k].qty)) + "";
					currentList[k].qty = newQty;
				} else {
					currentList[k] = o[k];
				}
			}
			return $http.post("/data/current", currentList).success(function(data){
			  console.log("Add to List", data);
		  });
		};

		this.update = function(list){
			return $http.post("/data/current", list).success(function(data){
			  console.log("Update List", data);
		  });
		};
		
		this.get = function(){
			return currentList;
		};		

		this.clear = function(){
			currentList = {_id: currentList._id, user: "nams"};
			$rootScope.$broadcast("clearList");
			return $http.post("/data/current", currentList).success(function(data){
			  console.log("Clear List", data);
		  });
		};

	})

	.service('RecipeService', function($rootScope, $http, $location){
		var recipes;
		var currentRecipe = {};

		this.setAll = function(){
		  return $http.get("/data/recipes").success(function(data){
			  console.log("All Recipes", data)
		  	recipes = data;
		  	return data;
		  });
		};

		this.getAll = function(){
			return recipes;
		};
		
		this.set = function(recipe){
			currentRecipe = recipe;
		};
		
		this.get = function(){
			return currentRecipe;
		};

		this.remove = function(ingredient){
			var ing = currentRecipe.ingredients[ingredient];
			if (ing){
				if (ing.qty > 1){
					ing.qty = ing.qty - 1;
				} else {
					delete currentRecipe.ingredients[ingredient];
				}
			}
			return currentRecipe;
		};

		this.removeRecipe = function(){
			delete recipes[currentRecipe.name];
			$location.path("/");
		  $http.delete("/data/recipes/" + currentRecipe._id).success(function(data){
			  console.log("Remove Recipe", data)
		  });
		};

		this.addNew = function(newRecipe){
			newRecipe.name = newRecipe.title.replace(" ", "").toLowerCase();
			if (checkName(newRecipe.name)){
			  return $http.post("/data/addRecipe", newRecipe).success(function(data){
				  console.log("Add New Recipe", data);
				  recipes = data;
				  $location.path("/");
			  });
			}
		};

		function checkName(name){
			for (var k in recipes){
				if (recipes[k].name === name){
					return false;
				}
			}
			return true;
		};

	});













