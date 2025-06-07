// ファイルパス: src/components/InputForm.tsx

'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// propsの型定義を更新
type Prefecture = {
  prefectureCode: string;
  prefectureName: string;
  wage: number;
};

type InputFormProps = {
  prefectures: Prefecture[];
  selectedPrefectureCode: string;
  targetIncreaseRate: string;
  setSelectedPrefectureCode: (code: string) => void;
  setTargetIncreaseRate: (rate: string) => void;
  onCalculate: () => void;
};

export function InputForm({
  prefectures,
  selectedPrefectureCode,
  targetIncreaseRate,
  setSelectedPrefectureCode,
  setTargetIncreaseRate,
  onCalculate,
}: InputFormProps) {

  return (
    <div className="w-full">
      <div className="space-y-6">
        {/* 都道府県選択 */}
        <div className="grid w-full items-center gap-2">
          <Label htmlFor="prefecture">1. あなたの会社がある都道府県</Label>
          <Select
            onValueChange={(value) => setSelectedPrefectureCode(value)}
            defaultValue={selectedPrefectureCode}
          >
            <SelectTrigger id="prefecture">
              <SelectValue placeholder="都道府県を選択してください" />
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

        {/* 目標価格転嫁率入力 */}
        <div className="grid w-full items-center gap-2">
          <Label htmlFor="increase-rate">2. 目標とする価格転嫁率 (%)</Label>
          <Input
            id="increase-rate"
            type="number"
            placeholder="例: 4.1"
            value={targetIncreaseRate} // valueを追加
            onChange={(e) => setTargetIncreaseRate(e.target.value)}
          />
        </div>

        {/* 実行ボタン */}
        <Button className="w-full text-lg font-bold py-6" onClick={onCalculate}>
          交渉データを生成する！
        </Button>
      </div>
    </div>
  );
}