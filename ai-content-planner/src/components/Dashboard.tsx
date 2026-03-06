import React, { useState, useEffect } from 'react';
import { useUser } from '@insforge/react';
import { insforge } from '../lib/insforge';
import { Loader2, PlusCircle, Clock } from 'lucide-react';

interface ContentPlan {
    id: string;
    topic: string;
    created_at: string;
}

interface Idea {
    id: string;
    title: string;
    description: string;
    status: string;
}

export default function Dashboard() {
    const { user } = useUser();
    const [topic, setTopic] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [plans, setPlans] = useState<ContentPlan[]>([]);
    const [activePlanId, setActivePlanId] = useState<string | null>(null);
    const [ideas, setIdeas] = useState<Idea[]>([]);

    useEffect(() => {
        if (user) loadPlans();
    }, [user]);

    useEffect(() => {
        if (activePlanId) {
            loadIdeas(activePlanId);

            let isSubscribed = true;
            const setupRealtime = async () => {
                await insforge.realtime.connect();
                await insforge.realtime.subscribe(`plan:${activePlanId}`);

                insforge.realtime.on('idea_inserted', (payload: any) => {
                    if (isSubscribed) {
                        setIdeas(prev => [...prev, payload.idea]);
                    }
                });

                insforge.realtime.on('idea_updated', (payload: any) => {
                    if (isSubscribed) {
                        setIdeas(prev => prev.map(i => i.id === payload.idea.id ? payload.idea : i));
                    }
                });
            };

            setupRealtime();

            return () => {
                isSubscribed = false;
                insforge.realtime.unsubscribe(`plan:${activePlanId}`);
            };
        }
    }, [activePlanId]);

    async function loadPlans() {
        const { data } = await insforge.database
            .from('content_plans')
            .select('*')
            .eq('user_id', user?.id)
            .order('created_at', { ascending: false });
        if (data) {
            setPlans(data as ContentPlan[]);
            if (data.length > 0 && !activePlanId) {
                setActivePlanId(data[0].id);
            }
        }
    }

    async function loadIdeas(planId: string) {
        const { data } = await insforge.database
            .from('content_ideas')
            .select('*')
            .eq('plan_id', planId)
            .order('created_at', { ascending: true });
        if (data) setIdeas(data as Idea[]);
    }

    async function handleGenerate(e: React.FormEvent) {
        e.preventDefault();
        if (!topic.trim()) return;

        setIsGenerating(true);
        let planId = '';

        try {
            const { data: planData } = await insforge.database
                .from('content_plans')
                .insert([{ user_id: user?.id, topic }])
                .select();

            if (!planData || planData.length === 0) throw new Error("Failed to insert plan");

            planId = planData[0].id;
            setActivePlanId(planId);
            setPlans(prev => [planData[0] as ContentPlan, ...prev]);
            setTopic('');

            const completion = await insforge.ai.chat.completions.create({
                model: 'openai/gpt-4o-mini',
                messages: [{
                    role: 'user',
                    content: `Generate 5 unique content ideas for the topic: "${topic}". Return ONLY a JSON array of objects, where each object has "title" and "description" string fields.`
                }]
            });

            const rawText = completion.choices[0].message.content;
            const jsonStart = rawText.indexOf('[');
            const jsonEnd = rawText.lastIndexOf(']') + 1;
            const jsonArr = JSON.parse(rawText.substring(jsonStart, jsonEnd));

            const newIdeas = jsonArr.map((idea: any) => ({
                plan_id: planId,
                title: idea.title,
                description: idea.description,
                status: 'idea'
            }));

            await insforge.database.from('content_ideas').insert(newIdeas);

        } catch (err) {
            console.error("error generating ideas:", err);
            alert('Failed to generate ideas. Please try again.');
        } finally {
            setIsGenerating(false);
        }
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1 border-r border-white/10 pr-6">
                <h2 className="text-xl font-bold mb-6 text-white/90">My Plans</h2>
                <div className="space-y-3">
                    {plans.map(p => (
                        <button
                            key={p.id}
                            onClick={() => setActivePlanId(p.id)}
                            className={`block w-full text-left p-4 rounded-xl transition-all ${activePlanId === p.id
                                ? 'bg-indigo-500/20 border border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.2)]'
                                : 'bg-white/5 border border-white/5 hover:bg-white/10'
                                }`}
                        >
                            <h3 className="font-semibold text-white/80 line-clamp-1">{p.topic}</h3>
                            <p className="text-xs text-white/40 mt-1">{new Date(p.created_at).toLocaleDateString()}</p>
                        </button>
                    ))}
                    {plans.length === 0 && (
                        <div className="text-center p-6 border border-dashed border-white/10 rounded-xl text-white/40 text-sm">
                            No plans yet. Create your first topic!
                        </div>
                    )}
                </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
                <div className="glass-panel p-6 rounded-2xl mb-8 border border-white/10 bg-white/5 shadow-xl">
                    <h2 className="text-2xl font-bold mb-2">Create New Content Plan</h2>
                    <p className="text-white/50 mb-6 text-sm">Enter any topic, keyword, or vague concept and instantly get 5 actionable content pieces.</p>

                    <form onSubmit={handleGenerate} className="flex gap-4">
                        <input
                            type="text"
                            value={topic}
                            onChange={e => setTopic(e.target.value)}
                            placeholder="e.g. The future of quantum computing..."
                            className="flex-1 bg-black/40 border border-white/10 rounded-xl px-5 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium"
                            disabled={isGenerating}
                        />
                        <button
                            type="submit"
                            disabled={isGenerating || !topic.trim()}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <PlusCircle className="w-5 h-5" />}
                            Generate
                        </button>
                    </form>
                </div>

                {activePlanId && (
                    <div className="space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                            <h2 className="text-xl font-bold flex items-center gap-3">
                                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_10px_rgba(74,222,128,1)]"></span>
                                Generated Ideas
                            </h2>
                            <div
                                className="text-sm font-medium px-4 py-2 bg-white/5 border border-white/10 rounded-full cursor-pointer hover:bg-white/10 transition text-center"
                                onClick={() => {
                                    navigator.clipboard.writeText(`${window.location.origin}/dashboard/${activePlanId}`);
                                    alert('Share link copied to clipboard!');
                                }}
                            >
                                Share Public Link 🔗
                            </div>
                        </div>

                        {ideas.length === 0 && isGenerating && (
                            <div className="text-center p-12 glass-panel rounded-2xl bg-white/5 border border-white/10">
                                <Loader2 className="w-8 h-8 animate-spin mx-auto text-indigo-400 mb-4" />
                                <p className="text-white/60">Brewing brilliant ideas...</p>
                            </div>
                        )}

                        <div className="grid gap-4">
                            {ideas.map((idea, i) => (
                                <div key={idea.id} className="glass-panel p-5 rounded-2xl bg-white/5 border border-white/10 flex flex-col sm:flex-row gap-4 animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
                                    <div className="flex-shrink-0 mt-1">
                                        <Clock className="w-6 h-6 text-blue-400" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold text-white mb-2">{idea.title}</h3>
                                        <p className="text-white/60 text-sm leading-relaxed">{idea.description}</p>
                                        <div className="mt-4 flex gap-2">
                                            <span className="text-xs font-semibold px-2 py-1 bg-indigo-500/20 text-indigo-300 rounded-md uppercase tracking-wider">
                                                {idea.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {ideas.length === 0 && !isGenerating && (
                            <div className="text-center p-12 border border-dashed border-white/10 rounded-2xl text-white/40">
                                <p>No ideas yet for this plan. Try generating some above!</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
