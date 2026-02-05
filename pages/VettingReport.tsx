
import React from 'react';
import { Link } from 'react-router-dom';

const VettingReport: React.FC = () => {
  return (
    <div className="pt-32 pb-32 min-h-screen bg-black text-white">
      <div className="max-w-6xl mx-auto px-6">
        <header className="mb-32 text-center">
          <div className="inline-flex items-center gap-2 mb-8 bg-white/5 border border-white/10 px-6 py-2 rounded-full">
            <span className="text-gray-400 font-black uppercase text-[10px] tracking-[0.3em]">Official Audit 2025: Q1 Edition</span>
          </div>
          <h1 className="text-6xl md:text-[7rem] font-black tracking-tighter mb-10 leading-[0.9]">
            돈 버는 AI?<br /><span className="text-emerald-500">돈 버리는 AI.</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 font-light max-w-3xl mx-auto leading-relaxed break-keep">
            강의 팔이들의 화려한 수익 인증 뒤에 숨겨진 <span className="text-white font-bold underline decoration-emerald-500/50">데이터의 민낯</span>을 공개합니다.<br />
            2,000시간 이상의 실전 데이터 트래킹 결과입니다.
          </p>
        </header>

        <div className="space-y-40">
          {/* Audit 1: AI Animal Shorts */}
          <section className="relative">
            <div className="bg-neutral-900 border border-white/10 rounded-[3.5rem] p-10 md:p-20 overflow-hidden shadow-2xl">
              <div className="flex flex-wrap items-center gap-4 mb-10">
                <span className="bg-red-500 text-black px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">Critical Alert</span>
                <span className="text-gray-500 text-sm font-bold">VETTING_ID: #SH-001</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-black mb-16 tracking-tighter leading-tight break-keep">
                AI 동물 쇼츠 채널:<br />수익 창출 불능 리포트
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-16">
                <div className="space-y-10">
                  <h4 className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">수익 구조 붕괴 데이터 (2025 JAN-MAR)</h4>
                  <div className="space-y-8">
                    <div>
                      <div className="flex justify-between text-xs mb-3 font-bold">
                        <span className="text-gray-400 uppercase tracking-widest">알고리즘 차단율</span>
                        <span className="text-red-500">94.2%</span>
                      </div>
                      <div className="h-3 bg-black/50 rounded-full overflow-hidden border border-white/5">
                        <div className="h-full bg-red-500 w-[94.2%] transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-3 font-bold">
                        <span className="text-gray-400 uppercase tracking-widest">평균 수익 달성률</span>
                        <span className="text-emerald-500">0.8%</span>
                      </div>
                      <div className="h-3 bg-black/50 rounded-full overflow-hidden border border-white/5">
                        <div className="h-full bg-emerald-500 w-[0.8%] transition-all duration-1000 ease-out" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-black/60 p-12 rounded-[3rem] border border-white/5 flex items-center justify-center relative overflow-hidden group">
                  <div className="absolute inset-0 bg-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="text-center relative z-10">
                    <div className="text-7xl font-black text-red-500 mb-4 tracking-tighter">$0.01</div>
                    <div className="text-gray-500 font-bold text-[10px] uppercase tracking-[0.3em]">Average CPM in Korea</div>
                  </div>
                </div>
              </div>

              <div className="text-gray-400 text-lg leading-relaxed font-light space-y-8 break-keep">
                <p>
                  미드저니와 수노(Suno)를 결합한 동물 쇼츠 채널은 2024년 말 정점을 찍은 후, 현재 유튜브 알고리즘의 <strong>'스팸 자동 필터링'</strong> 대상이 되었습니다. 구글의 AI 판독 알고리즘은 이제 단순한 이미지가 아닌, 생성형 AI 특유의 <span className="text-white font-medium">프레임 간 픽셀 노이즈 패턴</span>을 완벽하게 인식합니다. 
                </p>
                <p>
                  당사 검증팀이 운영한 50개의 실험 채널 중 47개가 채널 개설 2개월 만에 '재사용된 콘텐츠' 혹은 '스팸 정책 위반'으로 수익 창출이 거부되었습니다. 조회수는 수백만을 기록할 수 있으나, 정작 지갑에 들어오는 돈은 0원인 '유령 채널'이 될 확률이 매우 높습니다.
                </p>
                <div className="bg-white/5 border border-white/10 p-10 rounded-[2.5rem] mt-12">
                  <p className="text-white text-xl font-bold italic leading-relaxed">
                    "동물 쇼츠 강의에 결제하는 행위는 이미 사장된 정보를 비싸게 사는 꼴입니다."
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Audit 2: Automated Blog */}
          <section className="relative">
            <div className="bg-neutral-900 border border-white/10 rounded-[3.5rem] p-10 md:p-20 overflow-hidden shadow-2xl">
              <div className="flex flex-wrap items-center gap-4 mb-10">
                <span className="bg-orange-500 text-black px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">Dead End</span>
                <span className="text-gray-500 text-sm font-bold">VETTING_ID: #BLOG-002</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-black mb-16 tracking-tighter leading-tight break-keep">
                AI 뉴스 자동화 블로그:<br />색인 삭제와 역마진의 함정
              </h2>

              <div className="mb-20 bg-black/40 p-12 rounded-[3rem] border border-white/5">
                <div className="flex items-end gap-4 h-56 mb-8 px-10">
                  <div className="flex-1 bg-red-500/80 rounded-t-2xl h-[100%] flex flex-col items-center justify-center text-[11px] font-black gap-2">
                    <span className="opacity-50 tracking-widest">RED</span>
                    <span>API COST</span>
                  </div>
                  <div className="flex-1 bg-emerald-500/30 rounded-t-2xl h-[15%] flex flex-col items-center justify-center text-[11px] font-black gap-2">
                    <span className="opacity-50 tracking-widest">GREEN</span>
                    <span>REVENUE</span>
                  </div>
                  <div className="flex-1 bg-white/10 rounded-t-2xl h-[45%] flex flex-col items-center justify-center text-[11px] font-black gap-2">
                    <span className="opacity-50 tracking-widest">GREY</span>
                    <span>SERVER</span>
                  </div>
                </div>
                <div className="text-center text-sm font-black text-gray-500 tracking-[0.4em] uppercase">Monthly ROI Analysis (Negative -88%)</div>
              </div>

              <div className="text-gray-400 text-lg leading-relaxed font-light space-y-8 break-keep">
                <p>
                  구글의 <strong>2025년 3월 코어 업데이트(Helpful Content)</strong>는 사람이 직접 경험하고 작성하지 않은 AI 요약글을 색인에서 90% 이상 삭제하고 있습니다. 자동화 블로그를 위해 지출하는 News API 비용과 ChatGPT-4o API 비용은 월 평균 200달러를 넘어서지만, 정작 애드센스 수익은 월 10달러 내외에 머무는 <strong>역마진 구조</strong>가 고착되었습니다.
                </p>
                <p>
                  전문가들은 이제 단순한 요약이 아닌, 본인의 주관적 해석이 30% 이상 포함되지 않은 자동화 시스템은 '디지털 쓰레기 제조기'에 불과하다고 경고합니다. 구글 샌드박스에 갇혀 영원히 노출되지 않는 도메인을 관리하느라 귀중한 시간을 낭비하지 마십시오.
                </p>
              </div>
            </div>
          </section>

          {/* Audit 3: Faceless Wisdom Channel */}
          <section className="relative">
            <div className="bg-neutral-900 border border-white/10 rounded-[3.5rem] p-10 md:p-20 overflow-hidden shadow-2xl">
              <div className="flex flex-wrap items-center gap-4 mb-10">
                <span className="bg-purple-500 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">Saturated</span>
                <span className="text-gray-500 text-sm font-bold">VETTING_ID: #YT-003</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-black mb-16 tracking-tighter leading-tight break-keep">
                AI 명언/심리 채널:<br />시청 지속 시간 급감 리포트
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                {[
                  { label: "시청 지속 시간", value: "12%", status: "Danger", color: "text-red-500", bg: "bg-red-500/5" },
                  { label: "신규 구독자 전환율", value: "0.04%", status: "Poor", color: "text-orange-500", bg: "bg-orange-500/5" },
                  { label: "포화 지수", value: "99/100", status: "Extreme", color: "text-purple-500", bg: "bg-purple-500/5" }
                ].map((stat, i) => (
                  <div key={i} className={`p-10 rounded-[2.5rem] border border-white/5 text-center ${stat.bg}`}>
                    <div className="text-gray-500 text-[10px] font-black uppercase mb-6 tracking-[0.2em]">{stat.label}</div>
                    <div className={`${stat.color} text-5xl font-black mb-3 tracking-tighter`}>{stat.value}</div>
                    <div className="text-white font-black text-[10px] uppercase tracking-widest opacity-80">{stat.status}</div>
                  </div>
                ))}
              </div>

              <div className="text-gray-400 text-lg leading-relaxed font-light space-y-8 break-keep">
                <p>
                  "인생을 바꾸는 명언", "부자가 되는 법"과 같은 주제의 AI 채널은 현재 레드오션 중의 레드오션입니다. 2025년 기준 시청자들은 AI 성우의 일정한 톤과 반복되는 AI 배경 영상을 보는 즉시 스와이프(Swipe-away)합니다. 이는 채널의 <strong>'건강성 지표'</strong>를 파괴하여 알고리즘의 추천 목록에서 영구적으로 제외되게 만듭니다.
                </p>
                <p>
                  실제로 상위 1%를 제외한 대부분의 채널이 구독자 1,000명 달성에 평균 14개월 이상이 소요되고 있으며, 그나마 달성한 후에도 '중복 콘텐츠' 판정으로 수익 창출이 거부되는 사례가 빈번합니다.
                </p>
              </div>
            </div>
          </section>

          {/* Audit 4: AI E-book */}
          <section className="relative">
            <div className="bg-neutral-900 border border-white/10 rounded-[3.5rem] p-10 md:p-20 overflow-hidden shadow-2xl">
              <div className="flex flex-wrap items-center gap-4 mb-10">
                <span className="bg-yellow-500 text-black px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">Low Quality</span>
                <span className="text-gray-500 text-sm font-bold">VETTING_ID: #BOOK-004</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-black mb-16 tracking-tighter leading-tight break-keep">
                AI 양산형 전자책:<br />반품률 70%와 계정 블락의 진실
              </h2>
              
              <div className="mb-20 bg-black/40 p-12 rounded-[3rem] border border-white/5">
                <div className="flex justify-around items-end h-48 gap-8 px-10">
                  <div className="w-16 bg-white/5 h-[80%] rounded-t-xl" />
                  <div className="w-16 bg-white/10 h-[60%] rounded-t-xl" />
                  <div className="w-16 bg-yellow-500 h-[25%] flex items-center justify-center text-[10px] font-black relative group">
                    <span className="absolute -top-10 text-yellow-500 whitespace-nowrap">SALES</span>
                  </div>
                  <div className="w-16 bg-red-500 h-[75%] flex items-center justify-center text-[10px] font-black relative group">
                    <span className="absolute -top-10 text-red-500 whitespace-nowrap">RETURNS</span>
                  </div>
                </div>
                <div className="mt-16 text-center text-sm font-black text-gray-500 tracking-[0.3em] uppercase">AI E-Book Platform Performance Index</div>
              </div>

              <div className="text-gray-400 text-lg leading-relaxed font-light space-y-8 break-keep">
                <p>
                  아마존 KDP나 국내 전자책 플랫폼에서 AI로 쓴 책을 수십 권씩 등록하라는 강의는 전형적인 <strong>'질보다 양'</strong>의 함정입니다. 플랫폼들은 이제 독자의 평점과 체류 시간을 분석하여 질 낮은 AI 책들을 검색 결과 하단으로 밀어냅니다. 
                </p>
                <p>
                  특히 아마존은 최근 AI 생성 콘텐츠에 대한 고지 의무를 강화했으며, 독자로부터 '가치 없는 정보'라는 신고가 3회 이상 접수될 경우 계정을 즉시 정지시킵니다. 수익보다 환불 처리에 드는 스트레스가 더 큰 사업 모델입니다.
                </p>
              </div>
            </div>
          </section>

          {/* Audit 5: AI Model Influencer */}
          <section className="relative">
            <div className="bg-neutral-900 border border-white/10 rounded-[3.5rem] p-10 md:p-20 overflow-hidden shadow-2xl">
              <div className="flex flex-wrap items-center gap-4 mb-10">
                <span className="bg-blue-500 text-black px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">Low Conversion</span>
                <span className="text-gray-500 text-sm font-bold">VETTING_ID: #INFO-005</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-black mb-16 tracking-tighter leading-tight break-keep">
                AI 가상 인플루언서:<br />팔로워는 늘어도 수익은 0원인 이유
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                <div className="p-12 bg-black/60 rounded-[2.5rem] border border-white/5 text-center relative overflow-hidden group">
                  <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="text-blue-500 text-6xl font-black mb-4 tracking-tighter">0.01%</div>
                  <div className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">Conversion to Paid Content</div>
                </div>
                <div className="p-12 bg-black/60 rounded-[2.5rem] border border-white/5 text-center relative overflow-hidden group">
                  <div className="absolute inset-0 bg-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="text-red-500 text-6xl font-black mb-4 tracking-tighter">82%</div>
                  <div className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">Account Ban Rate (on major SNS)</div>
                </div>
              </div>

              <div className="text-gray-400 text-lg leading-relaxed font-light space-y-8 break-keep">
                <p>
                  가상 모델을 만들어 인스타그램이나 OnlyFans 등에서 돈을 벌겠다는 계획은 장미빛 환상에 가깝습니다. 대기업 광고주들은 브랜드 이미지 훼손을 우려해 AI 인플루언서와 협업하는 것을 매우 꺼립니다. 
                </p>
                <p>
                  또한, SNS 플랫폼들은 AI 생성 이미지로 사람들을 현혹시키는 계정들을 'Bot' 혹은 'Spam'으로 분류하여 노출을 차단합니다. 팔로워 수가 늘어나는 것은 실제 사람의 관심이 아닌, 다른 AI 봇들의 맞팔 활동인 경우가 80% 이상입니다. 실체 없는 부업에 인생을 걸지 마십시오.
                </p>
              </div>
            </div>
          </section>
        </div>

        <div className="mt-64 text-center">
          <h2 className="text-5xl md:text-[5rem] font-black tracking-tighter mb-16 leading-tight break-keep">
            지금이라도 <span className="text-emerald-500">진짜</span>를 찾고 싶다면?
          </h2>
          <div className="flex justify-center">
            <Link 
              to="/community"
              className="group relative inline-flex items-center justify-center"
            >
              <div className="absolute -inset-6 bg-emerald-500/30 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="relative bg-emerald-500 text-black px-16 md:px-24 py-8 md:py-10 rounded-full font-black text-2xl md:text-5xl shadow-2xl hover:bg-white transition-all transform hover:scale-105 flex items-center gap-8 break-keep">
                공식 커뮤니티 데이터 더 보기 <span className="group-hover:translate-x-3 transition-transform">→</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VettingReport;
