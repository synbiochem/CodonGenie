codonGenieApp.controller("codonGenieCtrl", ["$scope", "$http", "$log", "ErrorService", function($scope, $http, $log, ErrorService) {
	var self = this;
	self.isCalculating = false;
	self.query = {"mode": "aminoAcids"};
	self.aa_pattern = "[qwertyipasdfghklcvnmQWERTYIPASDFGHKLCVNM]*";
	self.codon_pattern = "[acgtmrwsykvhdbnACGTMRWSYKVHDBN]{3}";
	
	var results = null;
	
	self.submit = function() {
		self.isCalculating = true;
		results = null;
		
		if(self.query.mode == "aminoAcids") {
			self.query.aminoAcids = self.query.aminoAcids.toUpperCase()
			params = {"aminoAcids": self.query.aminoAcids,
				"organism": self.query["organism"]["id"]}
		}
		else {
			params = {"codon": self.query.codon,
				"organism": self.query["organism"]["id"]}
		}
		
		$http.get("codons", {params: params}).then(
				function(resp) {
					results = resp.data;
					self.isCalculating = false;
				},
				function(errResp) {
					$log.error(errResp.data.message);
					ErrorService.open(errResp.data.message);
					self.isCalculating = false;
				});
	};
	
	self.results = function() {
		return results;
	};
	
	self.getCodonString = function(codon) {
		return "[" + codon.join("][") + "]";
	};
	
	self.toString = function(array) {
		var len = array.length;
		var formatted = [array.length];
		
		for(var i = 0; i < len; i++) {
			formatted[i] = array[i][0] + " (" + array[i][1].toFixed(2) + ")";
		}
		
		return formatted.join(", ");
	};
	
	$scope.$watch(function() {
		return self.query;
	},               
	function(values) {
		results = null;
	}, true);
}]);