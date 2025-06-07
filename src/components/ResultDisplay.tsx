// ファイルパス: src/components/ResultDisplay.tsx

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ResultDataType } from "@/app/page";

type ResultDisplayProps = {
  calculationData: any;
  referenceRate: number | null;
  targetIncreaseRate: string;
  generatedComment: string;
  onTargetRateChange: (value: string) => void;
  onGenerateComment: () => void;
};

export function ResultDisplay({
  calculationData,
  referenceRate,
  targetIncreaseRate,
  generatedComment,
  onTargetRateChange,
  onGenerateComment,
}: ResultDisplayProps) {

  if (!calculationData) return null;

  const { selectedPrefecture, nationalStats, industryData } = calculationData;

  return (
    <div className="w-full max-w-2xl mx-auto mt-8 animate-fade-in">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">ステップ1：現状を把握する</CardTitle>
          <CardDescription>
            あなたの地域と業界に関連する客観的なデータです。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* --- 労務費関連セクション（完全版） --- */}
          <div>
            <h3 className="text-lg font-semibold mb-2 border-b pb-1">労務費関連</h3>
            <div className="space-y-2 text-sm">
              <p>・<strong>全国の最低賃金上昇率:</strong> {nationalStats.minimumWageIncreaseRate.value}{nationalStats.minimumWageIncreaseRate.unit} ( <a href={nationalStats.minimumWageIncreaseRate.source.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{nationalStats.minimumWageIncreaseRate.source.name}</a> )</p>
              <p>・<strong>{selectedPrefecture.prefectureName}の最低賃金:</strong> {selectedPrefecture.wage}円</p>
              <p>・<strong>建設業の平均賃上げ率:</strong> {industryData.construction.averageWageIncreaseRate.value}{industryData.construction.averageWageIncreaseRate.unit} ( <a href={industryData.construction.averageWageIncreaseRate.source.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{industryData.construction.averageWageIncreaseRate.source.name}</a> )</p>
              <p>・<strong>消費者物価指数:</strong> {nationalStats.consumerPriceIndex.value}{nationalStats.consumerPriceIndex.unit}上昇 ({nationalStats.consumerPriceIndex.comparisonPeriod}) ( <a href={nationalStats.consumerPriceIndex.source.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{nationalStats.consumerPriceIndex.source.name}</a> )</p>
            </div>
          </div>

          {/* --- 主要資材費関連セクション（完全版） --- */}
          <div>
            <h3 className="text-lg font-semibold mb-2 border-b pb-1">主要資材費関連（建設業）</h3>
            <div className="space-y-4 text-sm">
              {industryData.construction.materialCosts.map((material: any, index: number) => (
                <div key={index}>
                  <p>・<strong>{material.materialName}価格の動向:</strong> {material.priceTrend.value} ( <a href={material.priceTrend.source.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{material.priceTrend.source.name}</a> )</p>
                  <p className="pl-4 text-slate-600">→ {material.marketSummary}</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-2xl">ステップ2：目標を設定する</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {referenceRate !== null && (
            <div className="p-3 bg-yellow-100 border border-yellow-300 rounded-md">
              <p className="text-sm font-semibold text-yellow-800">参考値：これらのコスト上昇要因を総合的に考慮すると、約<strong className="text-xl">{referenceRate}%</strong>の価格転嫁がひとつの目安と考えられます。</p>
              <p className="text-xs text-slate-500 mt-1">※この数値は公的なものではなく、当サイトが提示する参考値です。</p>
            </div>
          )}
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="increase-rate" className="font-semibold">あなたの目標転嫁率 (%)</Label>
            <Input
              id="increase-rate"
              type="number"
              placeholder="例: 4.1"
              value={targetIncreaseRate}
              onChange={(e) => onTargetRateChange(e.target.value)}
              className="text-lg"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-2xl">ステップ3：交渉の武器を手に入れる</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button className="w-full text-lg font-bold py-6" onClick={onGenerateComment}>
            交渉コメントを生成する！
          </Button>
          {generatedComment && (
            <div className="p-4 bg-slate-100 rounded-md text-sm whitespace-pre-wrap animate-fade-in">
              <p>{generatedComment}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}