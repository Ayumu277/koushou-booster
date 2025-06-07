// ファイルパス: src/app/page.tsx

'use client';

import { useState } from 'react';
import costData from '@/data/cost-data.json';
import { ResultDisplay } from '@/components/ResultDisplay';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from '@/components/ui/label';

export type ResultDataType = any; // MVPなのでanyで簡略化

export default function Home() {
  const prefectures = costData.minimumWagesByPrefecture;

  const [selectedPrefectureCode, setSelectedPrefectureCode] = useState<string>('');
  const [targetIncreaseRate, setTargetIncreaseRate] = useState<string>('');
  const [referenceRate, setReferenceRate] = useState<number | null>(null);
  const [generatedComment, setGeneratedComment] = useState<string>('');
  const [calculationData, setCalculationData] = useState<any>(null);

  const handlePrefectureChange = (code: string) => {
    setSelectedPrefectureCode(code);
    setGeneratedComment('');

    const selectedPrefecture = prefectures.find(p => p.prefectureCode === code);
    if (!selectedPrefecture || !selectedPrefecture.previousWage) return; // previousWageがない場合は計算しない

    // --- ここからが最終進化ポイント！ ---
    // 1. 都道府県別の最低賃金上昇率を計算
    const prefectureIncreaseRate = ((selectedPrefecture.wage - selectedPrefecture.previousWage) / selectedPrefecture.previousWage) * 100;

    // 2. 参考転嫁率の計算に、全国平均の代わりに「都道府県別の上昇率」を使う
    const rates = [
      prefectureIncreaseRate, // ★★★ここが、全国一律のデータから、今計算した地域ごとのデータに進化した！★★★
      costData.industryData.construction.averageWageIncreaseRate.value,
      costData.nationalStats.consumerPriceIndex.value,
      ...costData.industryData.construction.materialCosts.map(material =>
        parseFloat(material.priceTrend.value.replace(/[^0-9.]/g, ''))
      )
    ];
    // --- ここまで ---

    const averageRate = rates.reduce((sum, rate) => sum + rate, 0) / rates.length;
    const roundedRate = Math.round(averageRate * 10) / 10;

    setReferenceRate(roundedRate);
    setTargetIncreaseRate(String(roundedRate));

    setCalculationData({
      selectedPrefecture: {
        prefectureName: selectedPrefecture.prefectureName,
        wage: selectedPrefecture.wage,
      },
      nationalStats: costData.nationalStats,
      industryData: costData.industryData,
    });
  };

  // --- 交渉コメントを生成する処理（完全版） ---
  const handleGenerateComment = () => {
    if (!calculationData) return;

    let commentTemplate = costData.commentTemplates.construction_default;
    const { selectedPrefecture, nationalStats, industryData } = calculationData;

    // --- ここが置換ロジックの完全版です！ ---
    const replacements = {
      '{nationalStats.minimumWageIncreaseRate.value}': nationalStats.minimumWageIncreaseRate.value,
      '{selectedPrefecture.prefectureName}': selectedPrefecture.prefectureName,
      '{selectedPrefecture.wage}': selectedPrefecture.wage,
      '{industryData.construction.averageWageIncreaseRate.value}': industryData.construction.averageWageIncreaseRate.value,
      '{nationalStats.consumerPriceIndex.value}': nationalStats.consumerPriceIndex.value,
      '{nationalStats.consumerPriceIndex.comparisonPeriod}': nationalStats.consumerPriceIndex.comparisonPeriod,
      '{industryData.construction.materialCosts[0].materialName}': industryData.construction.materialCosts[0].materialName,
      '{industryData.construction.materialCosts[0].priceTrend.value}': industryData.construction.materialCosts[0].priceTrend.value,
      '{industryData.construction.materialCosts[1].materialName}': industryData.construction.materialCosts[1].materialName,
      '{industryData.construction.materialCosts[1].priceTrend.value}': industryData.construction.materialCosts[1].priceTrend.value,
      '{industryData.construction.materialCosts[2].materialName}': industryData.construction.materialCosts[2].materialName,
      '{industryData.construction.materialCosts[2].priceTrend.value}': industryData.construction.materialCosts[2].priceTrend.value,
      '{targetIncreaseRate}': targetIncreaseRate || '〇',
    };
    // --- ここまで ---

    for (const [key, value] of Object.entries(replacements)) {
      commentTemplate = commentTemplate.replaceAll(key, String(value));
    }
    setGeneratedComment(commentTemplate);
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-8 bg-slate-50">
      <div className="w-full max-w-4xl">
        <header className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold">建設業コストアップ交渉ブースター</h1>
          <p className="text-slate-600 mt-2">客観的データを元に、あなたの価格交渉をサポートします。</p>
        </header>

        <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md border">
          <Label htmlFor="prefecture" className="font-semibold text-lg">まず、あなたの会社がある都道府県を選択してください。</Label>
          <Select onValueChange={handlePrefectureChange} value={selectedPrefectureCode}>
            <SelectTrigger id="prefecture" className="mt-2 text-lg">
              <SelectValue placeholder="都道府県を選択..." />
            </SelectTrigger>
            <SelectContent>
              {prefectures.map((pref) => (
                <SelectItem key={pref.prefectureCode} value={pref.prefectureCode}>
                  {pref.prefectureName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <ResultDisplay
          calculationData={calculationData}
          referenceRate={referenceRate}
          targetIncreaseRate={targetIncreaseRate}
          generatedComment={generatedComment}
          onTargetRateChange={setTargetIncreaseRate}
          onGenerateComment={handleGenerateComment}
        />
      </div>
    </main>
  );
}