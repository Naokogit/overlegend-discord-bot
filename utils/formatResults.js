const emojis = require('../configs/emojis.json');

// const emojis = {
//     le: '',
//     me: '',
//     re: '',
//     lf: '',
//     mf: '',
//     rf: '',
//   };
   
  function formatResults(upvotes = [], downvotes = []) {
    const totalVotes = upvotes.length + downvotes.length;
    const progressBarLength = 10;
    const filledSquares = Math.round((upvotes.length / totalVotes) * progressBarLength) || 0;
    const emptySquares = progressBarLength - filledSquares || 0;
   
    if (!filledSquares && !emptySquares) {
      emptySquares = progressBarLength;
    }
   
    const upPercentage = (upvotes.length / totalVotes) * 100 || 0;
    const downPercentage = (downvotes.length / totalVotes) * 100 || 0;
   
    const progressBar =
      (filledSquares ? emojis.lf : emojis.le) +
      (emojis.mf.repeat(filledSquares) + emojis.me.repeat(emptySquares)) +
      (filledSquares === progressBarLength ? emojis.rf : emojis.re);
   
    const results = [];
    results.push(
      `${emojis.upvote} **${upvotes.length} Upvotes** (${upPercentage.toFixed(1)}%) • ${emojis.downvote} **${
        downvotes.length
      } Downvotes** (${downPercentage.toFixed(1)}%)`
    );
    results.push(progressBar);
   
    return results.join('\n');
  }
   
  module.exports = formatResults;