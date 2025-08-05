import React from "react";
import { FaMedal } from "react-icons/fa";
import { IoDiamond } from "react-icons/io5";
import { FaRankingStar } from "react-icons/fa6";

const RANKS = [
    { name: "Bronze", icon: <FaMedal className="text-[#cd7f32]" />, min: 0, next: 1000 },
    { name: "Silver", icon: <FaMedal className="text-[#C0C0C0]" />, min: 1000, next: 3000 },
    { name: "Gold", icon: <FaMedal className="text-[#FFD700]" />, min: 3000, next: 7000 },
    { name: "Diamond", icon: <IoDiamond className="text-[#00BFFF]" />, min: 7000, next: null },
];

function getRankInfo(rankName) {
    return RANKS.find(r => r.name === rankName) || RANKS[0];
}

const MemberRank = ({ rank, pointsMemberShip }) => {
    const rankInfo = getRankInfo(rank);
    const percent = rankInfo.next
        ? Math.min(
            100,
            ((pointsMemberShip - rankInfo.min) / (rankInfo.next - rankInfo.min)) * 100
        )
        : 100;

    const rankColor = {
        Bronze: "#cd7f32",
        Silver: "#C0C0C0",
        Gold: "#FFD700",
        Diamond: "#00BFFF"
    }[rank] || "#333";

    return (
        <div>
            <div className="flex items-center gap-2 font-semibold justify-between">
                <span className="text-gray-600 flex items-center gap-2"><FaRankingStar className="text-purple-600"/> Rank:</span>
                <span className="flex items-center gap-1" style={{ color: rankColor }}>
                    {rankInfo.icon} {rank}
                </span>
            </div>
            <div className="mt-2">
                <div className="flex justify-between text-xs mb-1">
                    <span>{pointsMemberShip} pts</span>
                    <span>
                        {rankInfo.next ? `Next: ${rankInfo.next} pts` : "Max Rank"}
                    </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                        className="bg-purple-500 h-3 rounded-full transition-all"
                        style={{ width: `${percent}%` }}
                    ></div>
                </div>
            </div>
        </div>
    );
};

export default MemberRank;