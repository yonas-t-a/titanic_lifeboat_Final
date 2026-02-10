import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';

const App = () => {
  const [formData, setFormData] = useState({ pclass: 3, sex_male: 1, age: 25 });
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePredict = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/predict', { // Relative path
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
      });
      const data = await response.json();
      setResults(data.results);
    } catch (error) {
      console.error("Inference failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-[#09090b] antialiased selection:bg-slate-200">
      <div className="max-w-6xl mx-auto py-12 px-6 space-y-10">
        
        {/* Header */}
        <header className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Titanic Lifeboat Gates</h1>
          <p className="text-slate-500 text-lg font-medium">Parallel algorithmic survival prediction.</p>
        </header>

        {/* Input Card */}
        <section className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="p-6">
            <form onSubmit={handlePredict} className="grid grid-cols-1 md:grid-cols-4 gap-6">
              
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">Passenger Class</label>
                <select 
                  value={formData.pclass}
                  onChange={(e) => setFormData({...formData, pclass: Number(e.target.value)})}
                  className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-950 transition-all"
                >
                  <option value={1}>First Class</option>
                  <option value={2}>Second Class</option>
                  <option value={3}>Third Class</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">Gender</label>
                <select 
                  value={formData.sex_male}
                  onChange={(e) => setFormData({...formData, sex_male: Number(e.target.value)})}
                  className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-950 transition-all"
                >
                  <option value={1}>Male</option>
                  <option value={0}>Female</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">Age</label>
                <input 
                  type="number"
                  step="0.1"
                  value={formData.age}
                  onChange={(e) => setFormData({...formData, age: e.target.value})}
                  className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-950 transition-all"
                />
              </div>

              <div className="flex items-end">
                <button 
                  disabled={loading}
                  type="submit" 
                  className="inline-flex items-center justify-center rounded-md bg-slate-900 px-8 py-2 text-sm font-medium text-white hover:bg-slate-800 h-10 w-full transition-all active:scale-[0.98] disabled:opacity-50"
                >
                  {loading ? <Loader2 className="animate-spin h-4 w-4" /> : "Predict"}
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* Results Grid */}
        {results && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-in">
            {results.map((gate) => (
              <div key={gate.name} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold tracking-tight text-xs text-slate-500 uppercase">{gate.name}</h3>
                  <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${gate.survived ? 'bg-slate-900 text-slate-50 border-transparent' : 'bg-white text-slate-900 border-slate-200'}`}>
                    {gate.survived ? 'Survived' : 'Perished'}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-2xl font-bold tracking-tighter">
                    <span>{gate.prob}%</span>
                  </div>
                  <div className="relative h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <div 
                      className="h-full bg-slate-900 transition-all duration-1000 ease-out" 
                      style={{ width: `${gate.prob}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Likelihood of Survival</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Technical Addendum Section */}
        <div className="pt-20 mt-20 border-t border-slate-200 space-y-12">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <h2 className="text-[10px] font-bold tracking-[0.3em] uppercase text-slate-400">Technical Addendum</h2>
            <h3 className="text-4xl font-serif italic text-slate-900 leading-tight">
              A Comparative Analysis of Multi-Model Binary Classification in High-Stakes Disaster Recovery
            </h3>
            <div className="flex flex-col items-center space-y-1">
              <p className="text-sm font-bold text-slate-800">Yonas T. A.</p>
              <p className="text-xs text-slate-500 italic">Machine Learning Project</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-base leading-relaxed text-slate-700 font-serif max-w-4xl mx-auto">
            <div className="space-y-4">
              <p>
                <span className="text-4xl font-bold text-slate-900 float-left mr-3 mt-1 leading-none">T</span>his project presents a parallel inference framework for survival prediction using the historical Titanic passenger dataset. The system implements a multi-model architecture referred to as Lifeboat Gates, in which multiple machine learning models operate simultaneously on identical input features to generate independent probabilistic survival estimates.
              </p>
              <p>
                Rather than producing a single authoritative prediction, the system is designed as a comparative analytical structure in which each model functions as an independent inference agent. This architecture enables direct observation of how different mathematical and computational paradigms interpret the same historical data.
              </p>
              <p>
                The Logistic Gate serves as the statistical baseline model, applying a sigmoid transformation over a linear combination of features to produce interpretable survival probabilities.
              </p>
            </div>

            <div className="space-y-4">
              <p>
                The Random Forest and XGBoost gates represent ensemble-based and boosting-based learning systems that model complex non-linear relationships and hierarchical feature interactions.
              </p>
              <p>
                The SVM gate introduces margin-based geometric reasoning through decision boundary optimization in high-dimensional feature space, offering a fundamentally different representation of survivability.
              </p>
              <p>
                The objective of this project is to construct a transparent multi-model inference system that enables comparative reasoning, interpretability through model disagreement, and structural understanding of inductive bias.
              </p>
            </div>
          </div>
          
          <div className="flex justify-center items-center space-x-4 opacity-40">
            <div className="h-px w-12 bg-slate-400"></div>
            <span className="text-[10px] font-bold uppercase tracking-widest">Document Ref: RMS-1912-ML</span>
            <div className="h-px w-12 bg-slate-400"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;