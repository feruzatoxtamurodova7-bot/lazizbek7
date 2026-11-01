import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  Award,
  BookOpen,
  Languages,
  CheckCircle,
  ArrowRight,
  Flame,
  Star,
  Users,
  Compass,
  Zap,
} from 'lucide-react';
import { QUIZ_CATEGORIES, INITIAL_COURSES } from '../data/seed-data';

export const LandingPage: React.FC = () => {
  const { setActiveTab, setIsAuthModalOpen, setAuthMode, startQuiz } = useApp();

  const testimonials = [
    {
      name: 'Gulnoza Karimova',
      role: 'Toshkent tibbiyot akademiyasi talabasi',
      text: 'Rus tilidagi tibbiy atamalar va grammatikani o‘rganishda RusQuiz juda yordam berdi. Har kuni 10 daqiqa test yechish orqali so‘z boyligim keskin oshdi!',
      rating: 5,
    },
    {
      name: 'Otabek Mirzayev',
      role: 'Dasturchi',
      text: 'Mobile-first dizayn va xatolar kitobi ajoyib qulay. Ishga ketayotganda metroda test yechaman. Streak tizimi esa odat shakllantirishga katta turtki beradi.',
      rating: 5,
    },
    {
      name: 'Sevara Rahimova',
      role: 'Xalqaro munosabatlar fakulteti talabasi',
      text: 'Grammatika bo‘limidagi har bir testdan keyin o‘zbekcha aniq va tushunarli qoidaning chiqishi juda katta afzallik. Boshqa platformalarda bunday sifatli izoh yo‘q edi.',
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F7F8FC] dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-32 px-4 sm:px-6 lg:px-8">
        {/* Soft background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 dark:bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-80 h-80 bg-purple-500/10 dark:bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-[#4169E1] dark:text-blue-300 text-xs sm:text-sm font-bold mb-6 shadow-xs animate-in fade-in">
            <Sparkles className="w-4 h-4 text-[#4169E1]" />
            <span>RusQuiz — Zamonaviy rus tili ta’lim platformasi</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15] mb-6">
            Rus tilini oson va qiziqarli{' '}
            <span className="bg-gradient-to-r from-[#4169E1] via-[#8257E5] to-blue-500 bg-clip-text text-transparent">
              o‘rganing!
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-8 font-normal leading-relaxed">
            «Learn Russian. Test Yourself. Level Up.» Interaktiv testlar, o‘zbek tilidagi tushunarli
            izohlar, audio fleshkartalar va kundalik musobaqalar bilan o‘z bilimingizni yangi bosqichga olib chiqing.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => setActiveTab('home')}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-[#4169E1] to-[#8257E5] text-white font-bold text-base shadow-lg shadow-blue-500/25 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2.5"
            >
              <span>Boshlash</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              onClick={() => startQuiz('grammar', 'A1')}
              className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 font-bold text-base hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all shadow-xs flex items-center justify-center gap-2"
            >
              <Zap className="w-5 h-5 text-amber-500" />
              <span>Sinov testini yechish (A1)</span>
            </button>
          </div>

          {/* Social Proof Stats */}
          <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto mt-14 pt-8 border-t border-slate-200 dark:border-slate-800">
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">1000+</div>
              <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Test savollari</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#4169E1]">A1–C1</div>
              <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">CEFR Darajalari</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-purple-600 dark:text-purple-400">100%</div>
              <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">O‘zbekcha izohlar</div>
            </div>
          </div>
        </div>
      </section>

      {/* 6 Category Highlights */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">
            O‘rganish yo‘nalishlari
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            Rus tilining barcha muhim jihatlarini qamrab olgan 6 ta maxsus bo‘lim
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {QUIZ_CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              onClick={() => {
                setActiveTab('quizzes');
              }}
              className="group p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer"
            >
              <div
                className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${cat.color} flex items-center justify-center text-white mb-4 shadow-md group-hover:scale-110 transition-transform`}
              >
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                {cat.title_uz}
              </h3>
              <p className="text-xs font-semibold text-[#4169E1] mb-2">{cat.title_ru}</p>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {cat.description_uz}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Courses Levels */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-100/60 dark:bg-slate-900/40">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-[#4169E1] mb-2 block">
              Xalqaro standart
            </span>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">
              CEFR Darajalar bo‘yicha kurslar
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
              Noldan boshlab professional so‘zlashuv darajasigacha bosqichma-bosqich o‘sing
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {INITIAL_COURSES.map((course) => (
              <div
                key={course.level}
                onClick={() => setActiveTab('courses')}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-[#4169E1] cursor-pointer transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl font-black text-[#4169E1]">{course.level}</span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {course.total_lessons} dars
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                  {course.title_uz}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal line-clamp-3">
                  {course.description_uz}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">
            RusQuiz qanday ishlaydi?
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            Uchta oson qadamda rus tilini mukammal o‘zlashtiring
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center relative">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/50 text-[#4169E1] font-bold text-xl flex items-center justify-center mx-auto mb-4">
              1
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              Yo‘nalish va darajani tanlang
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Grammatika, lug‘at boyligi yoki imlo qoidalari bo‘yicha o‘z darajangizdagi testlarni tanlang.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center relative">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-900/50 text-[#8257E5] font-bold text-xl flex items-center justify-center mx-auto mb-4">
              2
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              Testlarni yeching va izohlarni o‘qing
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Har bir xato yoki to‘g‘ri javob ortidan o‘zbek tilida tushuntirilgan oltin qoidani o‘rganing.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center relative">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 font-bold text-xl flex items-center justify-center mx-auto mb-4">
              3
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              Xatolar kitobi va Reyting
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Xatolaringiz avtomatik saqlanadi. Ularni qayta topshirib, XP to‘plang va peshqadamlar ro‘yxatida ko‘tariling!
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-100/60 dark:bg-slate-900/40">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">
              Foydalanuvchilarimiz fikrlari
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
              RusQuiz bilan muvaffaqiyatga erishayotgan o‘quvchilar
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1 text-amber-400 mb-3">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-slate-700 dark:text-slate-300 italic mb-4 leading-relaxed">
                    «{t.text}»
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">{t.name}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Footer Banner */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#4169E1] to-[#8257E5] text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
              Bugunoq rus tilini o‘rganishni boshlang!
            </h2>
            <p className="text-blue-100 max-w-xl mx-auto mb-8 text-sm sm:text-base">
              Har kuni 10 ta savol yechib, 1 oyda 300+ yangi so‘z va asosiy grammatik qoidalarni mustahkamlang.
            </p>
            <button
              onClick={() => setActiveTab('home')}
              className="px-8 py-4 rounded-2xl bg-white text-[#4169E1] font-bold text-base hover:bg-slate-50 shadow-lg active:scale-95 transition-all"
            >
              Bepul boshlash
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400">
        <p>© 2026 RusQuiz. Barcha huquqlar himoyalangan. "Learn Russian. Test Yourself. Level Up."</p>
      </footer>
    </div>
  );
};
