import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { RusQuizStore } from '../services/store';
import { VocabularyWord, CEFRLevel } from '../types';
import {
  Languages,
  Search,
  Star,
  CheckCircle,
  Volume2,
  Rotate3d,
  Sparkles,
  BookMarked,
  Filter,
  Check,
  ChevronRight,
} from 'lucide-react';
import { speakRussian, playSound } from '../utils/audio';

export const VocabularyPage: React.FC = () => {
  const { addToast } = useApp();
  const [words, setWords] = useState<VocabularyWord[]>(() => RusQuizStore.getVocabulary());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<CEFRLevel | 'all'>('all');
  const [filterMode, setFilterMode] = useState<'all' | 'favorites' | 'unlearned'>('all');
  const [activeFlippedId, setActiveFlippedId] = useState<string | null>(null);

  // Daily vocabulary challenge word
  const dailyWord = words[0];

  const handleToggleLearned = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    playSound('click');
    const isLearned = RusQuizStore.toggleVocabularyLearned(id);
    setWords(RusQuizStore.getVocabulary());
    addToast(
      isLearned ? 'So‘z o‘zlashtirilganlar ro‘yxatiga qo‘shildi! (+5 XP)' : 'So‘z holati yangilandi',
      'success'
    );
  };

  const handleToggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    playSound('click');
    const isFav = RusQuizStore.toggleVocabularyFavorite(id);
    setWords(RusQuizStore.getVocabulary());
    addToast(isFav ? 'Sevimlilarga qo‘shildi' : 'Sevimlilardan olindi', 'info');
  };

  const handleFlip = (id: string) => {
    playSound('click');
    setActiveFlippedId(activeFlippedId === id ? null : id);
  };

  const filteredWords = words.filter((w) => {
    const matchesSearch =
      w.word_ru.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.translation_uz.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (selectedLevel !== 'all' && w.level !== selectedLevel) return false;

    if (filterMode === 'favorites' && !w.is_favorite) return false;
    if (filterMode === 'unlearned' && w.is_learned) return false;

    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 space-y-6 pb-24 md:pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Interaktiv rus tili lug‘ati
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Fleshkartalar, jonli ovozli talaffuz va kundalik so‘z boyligini kengaytirish mashqlari
        </p>
      </div>

      {/* Daily Vocabulary Challenge Banner */}
      {dailyWord && (
        <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-[#8257E5] to-[#4169E1] text-white shadow-lg relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold mb-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Kunning so‘zi (Слово дня)</span>
              </div>
              <div className="flex items-center gap-3">
                <h3 className="text-2xl sm:text-3xl font-black">{dailyWord.word_ru}</h3>
                <button
                  onClick={() => speakRussian(dailyWord.word_ru)}
                  className="p-2 rounded-xl bg-white/20 hover:bg-white/30 transition-colors"
                  title="Talaffuzni eshitish"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>
              <p className="text-base sm:text-lg text-purple-100 font-semibold mt-1">
                — {dailyWord.translation_uz}
              </p>
              <p className="text-xs text-blue-100 mt-2 italic">
                «{dailyWord.example_ru}» ({dailyWord.example_uz})
              </p>
            </div>

            <button
              onClick={(e) => handleToggleLearned(dailyWord.id, e)}
              className={`px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm self-start sm:self-auto transition-all shadow-md ${
                dailyWord.is_learned
                  ? 'bg-emerald-500 text-white'
                  : 'bg-white text-[#8257E5] hover:bg-slate-50'
              }`}
            >
              {dailyWord.is_learned ? '✓ Yodlandi' : 'Yodlangan deb belgilash'}
            </button>
          </div>
        </div>
      )}

      {/* Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Ruscha yoki o‘zbekcha so‘zni qidiring..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#4169E1]"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setFilterMode('all')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-colors ${
              filterMode === 'all'
                ? 'bg-[#4169E1] text-white'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            Barchasi ({words.length})
          </button>
          <button
            onClick={() => setFilterMode('favorites')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-colors flex items-center gap-1 ${
              filterMode === 'favorites'
                ? 'bg-amber-500 text-white'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            <Star className="w-3.5 h-3.5" />
            <span>Sevimlilar</span>
          </button>
          <button
            onClick={() => setFilterMode('unlearned')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-colors ${
              filterMode === 'unlearned'
                ? 'bg-purple-600 text-white'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            O‘rganilayotganlar
          </button>
        </div>
      </div>

      {/* Words Grid / Flashcards */}
      {filteredWords.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
          <Languages className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 dark:text-white">So‘zlar topilmadi</h3>
          <p className="text-xs text-slate-500 mt-1">Qidiruv parametrlarini o‘zgartirib ko‘ring</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredWords.map((word) => {
            const isFlipped = activeFlippedId === word.id;

            return (
              <div
                key={word.id}
                onClick={() => handleFlip(word.id)}
                className={`relative min-h-[220px] rounded-3xl border p-6 flex flex-col justify-between cursor-pointer transition-all duration-300 hover:shadow-lg ${
                  isFlipped
                    ? 'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-800/90 border-[#4169E1]'
                    : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                {/* Top Card Actions: Level badge, Favorite, Learned */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {word.level} • {word.category}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={(e) => handleToggleFavorite(word.id, e)}
                      className={`p-1.5 rounded-full transition-colors ${
                        word.is_favorite
                          ? 'text-amber-500 fill-amber-500'
                          : 'text-slate-400 hover:text-amber-500'
                      }`}
                    >
                      <Star className={`w-4 h-4 ${word.is_favorite ? 'fill-amber-500' : ''}`} />
                    </button>
                    <button
                      onClick={(e) => handleToggleLearned(word.id, e)}
                      className={`p-1.5 rounded-full transition-colors ${
                        word.is_learned
                          ? 'text-emerald-500'
                          : 'text-slate-400 hover:text-emerald-500'
                      }`}
                    >
                      <CheckCircle
                        className={`w-4 h-4 ${word.is_learned ? 'fill-emerald-500/20' : ''}`}
                      />
                    </button>
                  </div>
                </div>

                {/* Card Content (Flip state: front is Russian, back is Uzbek) */}
                {!isFlipped ? (
                  /* Front Side: Russian Word & Speech button */
                  <div className="my-auto py-2 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                        {word.word_ru}
                      </h3>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          speakRussian(word.word_ru);
                        }}
                        className="p-1.5 rounded-xl text-[#4169E1] hover:bg-blue-100 dark:hover:bg-blue-950/60"
                        title="Ovozli eshitish"
                      >
                        <Volume2 className="w-5 h-5" />
                      </button>
                    </div>
                    {word.part_of_speech && (
                      <span className="text-xs text-slate-400 block mt-1">
                        {word.part_of_speech}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 mt-4 font-semibold">
                      <Rotate3d className="w-3.5 h-3.5" />
                      <span>Tarjimasini ko‘rish uchun bosing</span>
                    </span>
                  </div>
                ) : (
                  /* Back Side: Uzbek Translation & Examples */
                  <div className="my-auto py-2 space-y-2 animate-in fade-in">
                    <div className="text-center">
                      <span className="text-xs font-bold text-[#4169E1] uppercase">O‘zbekcha:</span>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                        {word.translation_uz}
                      </h3>
                    </div>
                    <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-blue-100 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300">
                      <p className="font-semibold text-slate-800 dark:text-slate-200 italic mb-0.5">
                        «{word.example_ru}»
                      </p>
                      <p className="text-slate-500 dark:text-slate-400">— {word.example_uz}</p>
                    </div>
                  </div>
                )}

                {/* Footer status */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400">
                  <span>{word.is_learned ? '✓ O‘zlashtirilgan' : 'O‘rganilmoqda'}</span>
                  <span className="text-[#4169E1] font-semibold flex items-center gap-0.5">
                    <span>Aylantirish</span>
                    <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
