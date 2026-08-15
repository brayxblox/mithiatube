const SB_URL='https://mptolwedlrwgotrilrxr.supabase.co';
const SB_KEY=(function(){
  const a=['eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9','eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1wdG9sd2VkbHJ3Z290cmlscnhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY3OTIwNDUsImV4cCI6MjEwMjM2ODA0NX0','7Oz9w_EOs0RqL3U_4qPucph63VQNDOCwqdudwTpQN6I'];
  return a.join('.');
})();
const TABLE_VIDEO='video';
const TABLE_PROFILES='profiles';
const TABLE_COMMENTS='comments';
const HDRS={'apikey':SB_KEY,'Authorization':'Bearer '+SB_KEY,'Content-Type':'application/json','Prefer':'return=representation'};
