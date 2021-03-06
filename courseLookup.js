const levenshteinDistance = (str1 = '', str2 = '') => {
   const track = Array(str2.length + 1).fill(null).map(() =>
   Array(str1.length + 1).fill(null));
   for (let i = 0; i <= str1.length; i += 1) {
      track[0][i] = i;
   }
   for (let j = 0; j <= str2.length; j += 1) {
      track[j][0] = j;
   }
   for (let j = 1; j <= str2.length; j += 1) {
      for (let i = 1; i <= str1.length; i += 1) {
         const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
         track[j][i] = Math.min(
            track[j][i - 1] + 1, // deletion
            track[j - 1][i] + 1, // insertion
            track[j - 1][i - 1] + indicator, // substitution
         );
      }
   }
   return track[str2.length][str1.length];
};

//returns array of search queries that match
//query is input search query from home page
const getSearchQuery = (db, query) => {
	return new Promise((resolve, reject) => {
		var search_results = [];
		var sql = "SELECT * FROM courses";

		//Input min_distance
		return db.each(sql, (error, row) => {
            const min_distance = 30/query.length + .965*(row.title.length - query.length)
      
            console.log(min_distance);
            console.log( levenshteinDistance(row.title, query))
			if (error) {reject(error)};
			var dist = levenshteinDistance(row.title, query)
			if( dist <= min_distance){
				console.log("Course: " + row.title + "Id:  " + row.index);
				search_results.push({
					id: row.sectionID,
					class_title: row.title,
					class_num: row.num,
					instructors: row.fullNameInstructors,
					cross_listings: row.crossListings,
					quarter: row.quarter,
					section_id: row.sectionID
				});
			}
		}, () => {resolve(search_results)});

	})
}
//returns course information matching index
const getClassDetails = (db,id) => {
	console.log('id: ', id);
	var sql = "SELECT * FROM courses WHERE sectionID = " + id;
	return new Promise((resolve,reject) => {
			db.get(sql, (error, row) => {
			if(error) {
				console.log("error");
				reject(error);
			}
			else{
				console.log("Backend has: " + JSON.stringify(row) );
				resolve(row);
			}
		})
	})
}

module.exports.getSearchQuery = getSearchQuery;
module.exports.getClassDetails = getClassDetails
