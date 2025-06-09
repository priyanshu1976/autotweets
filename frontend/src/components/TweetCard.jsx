export default function TweetCard({ tweet }) {
  return (
    <div className="flex gap-3 p-4 bg-slate-800 rounded-lg">
      <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center text-white font-bold text-sm">
        ST
      </div>
      <div className="flex-1 space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <span className="font-medium text-white">{tweet.user}</span>
            <span className="text-slate-400 text-sm ml-2">Scheduled for {tweet.time}</span>
          </div>
          <span className="bg-purple-900 text-purple-300 px-2 py-1 rounded text-xs">Pending</span>
        </div>
        <p className="text-slate-300 text-sm">{tweet.content}</p>
        <div className="flex items-center gap-2">
          <span className="border border-slate-600 text-slate-400 px-2 py-1 rounded text-xs">{tweet.category}</span>
        </div>
      </div>
    </div>
  )
}
