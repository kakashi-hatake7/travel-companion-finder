import React, { useState } from 'react';
import { Package, Wallet, Calendar, Video, X, Briefcase } from 'lucide-react';
import PackingList from './PackingList';
import ExpenseSplitter from './ExpenseSplitter';
import ItineraryBuilder from './ItineraryBuilder';
import VideoCall from './VideoCall';
import './TripTools.css';

const TripTools = ({ tripId, tripData, currentUser, companionId, companionName, addToast, onClose }) => {
    const [activeTool, setActiveTool] = useState(null);

    const tools = [
        {
            id: 'packing',
            name: 'Packing List',
            description: 'Share what you\'re bringing',
            icon: Package,
            color: '#8b5cf6',
            gradient: 'linear-gradient(135deg, #8b5cf6, #a78bfa)'
        },
        {
            id: 'expenses',
            name: 'Expenses',
            description: 'Split costs easily',
            icon: Wallet,
            color: '#22c55e',
            gradient: 'linear-gradient(135deg, #22c55e, #4ade80)'
        },
        {
            id: 'itinerary',
            name: 'Itinerary',
            description: 'Plan your trip together',
            icon: Calendar,
            color: '#3b82f6',
            gradient: 'linear-gradient(135deg, #3b82f6, #60a5fa)'
        },
        {
            id: 'videocall',
            name: 'Video Call',
            description: 'Quick vibe check',
            icon: Video,
            color: '#ec4899',
            gradient: 'linear-gradient(135deg, #ec4899, #f472b6)'
        }
    ];

    const handleBack = () => {
        setActiveTool(null);
    };

    // Render active tool
    if (activeTool) {
        switch (activeTool) {
            case 'packing':
                return (
                    <PackingList
                        tripId={tripId}
                        currentUser={currentUser}
                        companionName={companionName}
                        addToast={addToast}
                        onClose={handleBack}
                    />
                );
            case 'expenses':
                return (
                    <ExpenseSplitter
                        tripId={tripId}
                        currentUser={currentUser}
                        companionId={companionId}
                        companionName={companionName}
                        addToast={addToast}
                        onClose={handleBack}
                    />
                );
            case 'itinerary':
                return (
                    <ItineraryBuilder
                        tripId={tripId}
                        tripDate={tripData?.date}
                        currentUser={currentUser}
                        companionName={companionName}
                        addToast={addToast}
                        onClose={handleBack}
                    />
                );
            case 'videocall':
                return (
                    <VideoCall
                        tripId={tripId}
                        currentUser={currentUser}
                        companionName={companionName}
                        addToast={addToast}
                        onClose={handleBack}
                    />
                );
            default:
                return null;
        }
    }

    // Render tools hub
    return (
        <div className="trip-tools-container dark:bg-slate-900 dark:text-slate-100">
            <div className="trip-tools-header dark:border-slate-800">
                <div className="tools-title">
                    <Briefcase size={24} />
                    <div>
                        <h2>Trip Tools</h2>
                        <p className="tools-subtitle dark:text-slate-400">
                            {tripData?.destination} with {companionName || 'your companion'}
                        </p>
                    </div>
                </div>
                <button className="tools-close-btn dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700" onClick={onClose}>
                    <X size={20} />
                </button>
            </div>

            <div className="tools-grid">
                {tools.map((tool) => {
                    const Icon = tool.icon;
                    return (
                        <button
                            key={tool.id}
                            className="tool-card dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-slate-700"
                            onClick={() => setActiveTool(tool.id)}
                            style={{ '--tool-color': tool.color, '--tool-gradient': tool.gradient }}
                        >
                            <div className="tool-icon">
                                <Icon size={28} />
                            </div>
                            <h3>{tool.name}</h3>
                            <p>{tool.description}</p>
                        </button>
                    );
                })}
            </div>

            <div className="tools-tip dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-200">
                <span className="tip-icon">💡</span>
                <p>
                    All tools sync in real-time with your companion.
                    Changes appear instantly for both of you!
                </p>
            </div>
        </div>
    );
};

export default TripTools;
