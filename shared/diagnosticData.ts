// ============================================================
// 80-Type Thinking Diagnostic Test – Shared Data & Types
// ============================================================

// ---- Base Types (16) ----
export const BASE_TYPES = [
  "INTJ","INTP","ENTJ","ENTP",
  "INFJ","INFP","ENFJ","ENFP",
  "ISTJ","ISFJ","ESTJ","ESFJ",
  "ISTP","ISFP","ESTP","ESFP",
] as const;
export type BaseType = typeof BASE_TYPES[number];

// ---- Cognitive Layers (5) ----
export const LAYER_LABELS = ["Execution","Analysis","Strategy","System","Macro"] as const;
export type LayerLabel = typeof LAYER_LABELS[number];

// ---- 80-Type Name Matrix  [BaseType][layerIndex] ----
export const TYPE_NAME_MATRIX: Record<BaseType, [string,string,string,string,string]> = {
  INTJ: ["精密な実行者","分析的戦略家","戦略的設計者","システム構築者","先見的預言者"],
  INTP: ["技術的職人","理論的分析家","概念的設計者","知識体系構築者","哲学的探究者"],
  ENTJ: ["指揮官","戦術的分析家","戦略的司令官","組織設計者","帝国建設者"],
  ENTP: ["機敏な実験者","パターン分析家","戦略的アーキテクト","イノベーション設計者","文明変革者"],
  INFJ: ["献身的支援者","洞察的分析家","ビジョン設計者","人間理解の体系者","精神的先導者"],
  INFP: ["共感的実践者","価値観分析家","理想設計者","意味体系構築者","人類的理想主義者"],
  ENFJ: ["カリスマ的実行者","人間関係分析家","組織文化設計者","社会変革者","人類的指導者"],
  ENFP: ["情熱的実験者","可能性分析家","創造的戦略家","変革システム設計者","未来創造者"],
  ISTJ: ["精密な守護者","データ分析の番人","制度設計者","社会基盤構築者","文明の守護者"],
  ISFJ: ["献身的な守護者","ケア分析家","支援制度設計者","福祉体系構築者","人類的保護者"],
  ESTJ: ["効率的管理者","業務分析家","組織戦略家","制度体系構築者","統治システム設計者"],
  ESFJ: ["調和的実行者","関係性分析家","コミュニティ設計者","社会調和構築者","文化的守護者"],
  ISTP: ["精密な技術者","メカニズム分析家","戦術的設計者","技術体系構築者","技術文明の先駆者"],
  ISFP: ["感性的職人","美的分析家","芸術的設計者","美的体系構築者","文化的創造者"],
  ESTP: ["即断即決の実行者","リスク分析家","機会戦略家","ビジネス体系構築者","市場変革者"],
  ESFP: ["エネルギッシュな実行者","体験分析家","エンタメ戦略家","体験設計者","文化的革新者"],
};

// ---- Layer descriptions ----
export const LAYER_DESCRIPTIONS: Record<LayerLabel, string> = {
  Execution: "具体的なタスクを確実に遂行する。目の前の問題を即座に解決し、手を動かして結果を出す。時間軸は「今日〜今週」。",
  Analysis: "データやパターンを読み解き、因果関係を特定する。問題の構造を分解し、最適解を導き出す。時間軸は「今週〜今月」。",
  Strategy: "中長期的な目標を設定し、リソース配分と優先順位を決定する。競争環境を読み、勝ち筋を設計する。時間軸は「今月〜1年」。",
  System: "複数の要素が相互に影響し合う複雑系を設計・最適化する。組織やプロセス全体のアーキテクチャを構築する。時間軸は「1年〜10年」。",
  Macro: "社会・文明レベルの大局的な変化を予見し、パラダイムシフトを構想する。歴史的・哲学的な視座から未来を描く。時間軸は「10年〜100年」。",
};

// ---- MBTI Dimension axes ----
export type MBTIDimension = "EI" | "SN" | "TF" | "JP";
export const MBTI_DIMENSIONS: MBTIDimension[] = ["EI","SN","TF","JP"];

// ---- Question types ----
export interface BaseTypeQuestion {
  id: string;
  dimension: MBTIDimension;
  text: string;
  optionA: { label: string; pole: string };
  optionB: { label: string; pole: string };
}

export interface LayerQuestion {
  id: string;
  text: string;
  options: { label: string; layer: number }[];
}

export interface PowerQuestion {
  id: string;
  text: string;
  options: { label: string; correct: boolean; trapType?: string }[];
  explanation: string;
}

export interface ShiftScenario {
  id: string;
  situation: string;
  phases: {
    description: string;
    options: { label: string; layer: number; quality: number }[];
  }[];
}

// ============================================================
// Base Type Questions (40 questions, 10 per dimension)
// ============================================================
export const BASE_TYPE_QUESTIONS: BaseTypeQuestion[] = [
  // E/I
  { id:"bt1", dimension:"EI", text:"新しいプロジェクトに取り組むとき、あなたはどちらに近いですか？",
    optionA:{label:"チームで議論しながらアイデアを出す",pole:"E"},
    optionB:{label:"一人で深く考えてから共有する",pole:"I"} },
  { id:"bt2", dimension:"EI", text:"エネルギーが充電されるのはどんなときですか？",
    optionA:{label:"人と活発に交流した後",pole:"E"},
    optionB:{label:"静かに一人で過ごした後",pole:"I"} },
  { id:"bt3", dimension:"EI", text:"問題解決のアプローチとして好むのは？",
    optionA:{label:"他者と対話しながら解決策を探る",pole:"E"},
    optionB:{label:"内省し、自分の中で答えを見つける",pole:"I"} },
  { id:"bt4", dimension:"EI", text:"会議やミーティングでのあなたの傾向は？",
    optionA:{label:"積極的に発言し、議論をリードする",pole:"E"},
    optionB:{label:"じっくり聞いてから、厳選した意見を述べる",pole:"I"} },
  { id:"bt5", dimension:"EI", text:"週末の理想的な過ごし方は？",
    optionA:{label:"友人や仲間と活動的に過ごす",pole:"E"},
    optionB:{label:"読書や趣味など、自分のペースで過ごす",pole:"I"} },
  // S/N
  { id:"bt6", dimension:"SN", text:"情報を処理するとき、あなたが重視するのは？",
    optionA:{label:"具体的な事実やデータ",pole:"S"},
    optionB:{label:"全体的なパターンや可能性",pole:"N"} },
  { id:"bt7", dimension:"SN", text:"仕事で最も信頼するのは？",
    optionA:{label:"過去の実績と検証済みの方法",pole:"S"},
    optionB:{label:"直感とまだ試されていないアイデア",pole:"N"} },
  { id:"bt8", dimension:"SN", text:"説明を受けるとき、どちらが理解しやすいですか？",
    optionA:{label:"具体的な例やステップバイステップの手順",pole:"S"},
    optionB:{label:"概念的な枠組みや全体像",pole:"N"} },
  { id:"bt9", dimension:"SN", text:"新しいスキルを学ぶとき、あなたは？",
    optionA:{label:"まず実践して体で覚える",pole:"S"},
    optionB:{label:"まず理論を理解してから取り組む",pole:"N"} },
  { id:"bt10", dimension:"SN", text:"計画を立てるとき、あなたが注目するのは？",
    optionA:{label:"現実的な制約と実行可能性",pole:"S"},
    optionB:{label:"理想的なビジョンと革新的な可能性",pole:"N"} },
  // T/F
  { id:"bt11", dimension:"TF", text:"重要な決断を下すとき、最も重視するのは？",
    optionA:{label:"論理的な分析と客観的な基準",pole:"T"},
    optionB:{label:"関係者の感情と価値観への影響",pole:"F"} },
  { id:"bt12", dimension:"TF", text:"フィードバックを与えるとき、あなたは？",
    optionA:{label:"率直に改善点を指摘する",pole:"T"},
    optionB:{label:"相手の気持ちに配慮しながら伝える",pole:"F"} },
  { id:"bt13", dimension:"TF", text:"チーム内で意見が対立したとき、あなたは？",
    optionA:{label:"最も論理的に正しい意見を支持する",pole:"T"},
    optionB:{label:"全員が納得できる落としどころを探す",pole:"F"} },
  { id:"bt14", dimension:"TF", text:"成功の定義として、あなたに近いのは？",
    optionA:{label:"目標を効率的に達成すること",pole:"T"},
    optionB:{label:"関わる人々が満足し成長すること",pole:"F"} },
  { id:"bt15", dimension:"TF", text:"問題が発生したとき、最初に考えるのは？",
    optionA:{label:"原因を特定し、再発防止策を立てる",pole:"T"},
    optionB:{label:"影響を受けた人のケアを優先する",pole:"F"} },
  // J/P
  { id:"bt16", dimension:"JP", text:"仕事の進め方として好むのは？",
    optionA:{label:"計画を立て、スケジュール通りに進める",pole:"J"},
    optionB:{label:"状況に応じて柔軟に対応する",pole:"P"} },
  { id:"bt17", dimension:"JP", text:"締め切りに対するあなたの態度は？",
    optionA:{label:"余裕を持って早めに完了させたい",pole:"J"},
    optionB:{label:"締め切り直前に集中力が最大化する",pole:"P"} },
  { id:"bt18", dimension:"JP", text:"旅行の計画を立てるとき、あなたは？",
    optionA:{label:"詳細なスケジュールを事前に決める",pole:"J"},
    optionB:{label:"大まかな方向だけ決めて、現地で判断する",pole:"P"} },
  { id:"bt19", dimension:"JP", text:"新しい情報が入ったとき、あなたは？",
    optionA:{label:"既存の計画に組み込み、決断を確定させる",pole:"J"},
    optionB:{label:"選択肢を開いたまま、さらに情報を集める",pole:"P"} },
  { id:"bt20", dimension:"JP", text:"デスクや作業環境について、あなたは？",
    optionA:{label:"整理整頓され、すべてが定位置にある",pole:"J"},
    optionB:{label:"一見散らかっているが、自分なりの秩序がある",pole:"P"} },
  // E/I (additional 5 questions)
  { id:"bt21", dimension:"EI", text:"新しい環境に入ったとき、あなたは？",
    optionA:{label:"すぐに人間関係を広げようとする",pole:"E"},
    optionB:{label:"まず周囲を観察して様子を見る",pole:"I"} },
  { id:"bt22", dimension:"EI", text:"ストレスを感じたときの対処法は？",
    optionA:{label:"友人に話を聞いてもらう",pole:"E"},
    optionB:{label:"一人で時間をかけて整理する",pole:"I"} },
  { id:"bt23", dimension:"EI", text:"仕事のやり方として好むのは？",
    optionA:{label:"チームで協力し、コミュニケーションを重視",pole:"E"},
    optionB:{label:"個人の裁量で独立して進める",pole:"I"} },
  { id:"bt24", dimension:"EI", text:"アイデアを得るときは？",
    optionA:{label:"ブレインストーミングなど集団での活動から",pole:"E"},
    optionB:{label:"瞑想や思考の時間から",pole:"I"} },
  { id:"bt25", dimension:"EI", text:"人間関係の充実度は？",
    optionA:{label:"多くの人との広い交流が重要",pole:"E"},
    optionB:{label:"深い信頼関係を持つ少数の人が重要",pole:"I"} },
  // S/N (additional 5 questions)
  { id:"bt26", dimension:"SN", text:"詳細と全体像のどちらに注意が向きやすい？",
    optionA:{label:"細かい部分や実装の詳細",pole:"S"},
    optionB:{label:"大きな構造や全体的なつながり",pole:"N"} },
  { id:"bt27", dimension:"SN", text:"経験から学ぶとき？",
    optionA:{label:"過去の事例をそのまま応用する",pole:"S"},
    optionB:{label:"原理を理解して新しい状況に応用する",pole:"N"} },
  { id:"bt28", dimension:"SN", text:"創造的な仕事で得意なのは？",
    optionA:{label:"既存の要素を組み合わせて改善する",pole:"S"},
    optionB:{label:"まったく新しい概念やアイデアを生み出す",pole:"N"} },
  { id:"bt29", dimension:"SN", text:"物事を信じるための条件は？",
    optionA:{label:"確かな証拠や実績がある",pole:"S"},
    optionB:{label:"理論的に筋が通っている",pole:"N"} },
  { id:"bt30", dimension:"SN", text:"複雑な問題に直面したとき？",
    optionA:{label:"段階的に具体的に解決していく",pole:"S"},
    optionB:{label:"全体像を理解してから対策を考える",pole:"N"} },
  // T/F (additional 5 questions)
  { id:"bt31", dimension:"TF", text:"公正さと思いやりのどちらを優先する？",
    optionA:{label:"ルールや基準を公平に適用する",pole:"T"},
    optionB:{label:"個別の事情を考慮して対応する",pole:"F"} },
  { id:"bt32", dimension:"TF", text:"職場での人間関係は？",
    optionA:{label:"プロフェッショナルな距離を保つ",pole:"T"},
    optionB:{label:"親密な関係を築きたい",pole:"F"} },
  { id:"bt33", dimension:"TF", text:"倫理的な問題に直面したとき？",
    optionA:{label:"規則や論理に基づいて判断",pole:"T"},
    optionB:{label:"人間的な価値観に基づいて判断",pole:"F"} },
  { id:"bt34", dimension:"TF", text:"組織の効率と調和のどちらを優先する？",
    optionA:{label:"効率性と成果を最優先",pole:"T"},
    optionB:{label:"チームの雰囲気と協調性を優先",pole:"F"} },
  { id:"bt35", dimension:"TF", text:"自分の判断基準は？",
    optionA:{label:"客観的な事実と論理",pole:"T"},
    optionB:{label:"個人的な価値観と信念",pole:"F"} },
  // J/P (additional 5 questions)
  { id:"bt36", dimension:"JP", text:"決断のタイミングは？",
    optionA:{label:"十分に情報を集めて決定する",pole:"J"},
    optionB:{label:"必要な情報が揃わなくても判断する",pole:"P"} },
  { id:"bt37", dimension:"JP", text:"プロジェクト管理のスタイルは？",
    optionA:{label:"マイルストーンを設定して進捲管理",pole:"J"},
    optionB:{label:"大まかな方向性を決めて柔軟に進める",pole:"P"} },
  { id:"bt38", dimension:"JP", text:"新しい情報が入ったとき？",
    optionA:{label:"既存の計画に組み込む",pole:"J"},
    optionB:{label:"計画を見直して新しい方向を探る",pole:"P"} },
  { id:"bt39", dimension:"JP", text:"完成度について？",
    optionA:{label:"完窜に仕上げてから提出したい",pole:"J"},
    optionB:{label:"ある程度のレベルで提出して改善する",pole:"P"} },
  { id:"bt40", dimension:"JP", text:"人生の進め方として？",
    optionA:{label:"明確な目標と計画を持ちたい",pole:"J"},
    optionB:{label:"流れに身を任せて柔軟に対応したい",pole:"P"} },
];

// ============================================================
// Cognitive Layer Questions (10 questions)
// ============================================================
export const LAYER_QUESTIONS: LayerQuestion[] = [
  { id:"lq1", text:"あなたが最もやりがいを感じる仕事の種類は？",
    options:[
      {label:"具体的なタスクを確実にこなし、目に見える成果を出す",layer:1},
      {label:"データを分析し、隠れたパターンや原因を発見する",layer:2},
      {label:"中長期的な戦略を立て、競争優位を設計する",layer:3},
      {label:"組織やプロセス全体の仕組みを設計・最適化する",layer:4},
      {label:"社会や業界全体の未来を構想し、パラダイムを変える",layer:5},
    ]},
  { id:"lq2", text:"問題に直面したとき、最初に考えることは？",
    options:[
      {label:"今すぐ何をすべきか（行動計画）",layer:1},
      {label:"なぜこの問題が起きたのか（原因分析）",layer:2},
      {label:"この問題は全体の戦略にどう影響するか",layer:3},
      {label:"この問題はシステム全体の欠陥を示しているか",layer:4},
      {label:"この問題は時代の転換点を示唆しているか",layer:5},
    ]},
  { id:"lq3", text:"あなたが最も自然に使う時間軸は？",
    options:[
      {label:"今日〜今週（目の前のタスク）",layer:1},
      {label:"今週〜今月（分析と改善サイクル）",layer:2},
      {label:"今月〜1年（戦略的計画）",layer:3},
      {label:"1年〜10年（システム設計）",layer:4},
      {label:"10年〜100年（文明レベルの変化）",layer:5},
    ]},
  { id:"lq4", text:"会議で最も価値を発揮できる役割は？",
    options:[
      {label:"アクションアイテムを整理し、実行計画を立てる",layer:1},
      {label:"データや事実を基に、議論の方向性を検証する",layer:2},
      {label:"競合分析や市場動向を踏まえた戦略提案をする",layer:3},
      {label:"部門間の連携や組織構造の改善案を提示する",layer:4},
      {label:"業界全体のトレンドや社会変化の視点を提供する",layer:5},
    ]},
  { id:"lq5", text:"読書や学習で最も惹かれるテーマは？",
    options:[
      {label:"実践的なスキルやノウハウ（How-to）",layer:1},
      {label:"データサイエンスや論理的思考法",layer:2},
      {label:"経営戦略やマーケティング理論",layer:3},
      {label:"組織論やシステム思考",layer:4},
      {label:"歴史哲学や文明論",layer:5},
    ]},
  { id:"lq6", text:"成功を測る基準として最も重視するのは？",
    options:[
      {label:"タスクの完了率と品質",layer:1},
      {label:"分析の正確さと洞察の深さ",layer:2},
      {label:"戦略目標の達成度",layer:3},
      {label:"システム全体の効率性と持続可能性",layer:4},
      {label:"社会へのインパクトと歴史的意義",layer:5},
    ]},
  { id:"lq7", text:"チームメンバーに最も求めるものは？",
    options:[
      {label:"確実な実行力と責任感",layer:1},
      {label:"鋭い分析力と論理的思考",layer:2},
      {label:"戦略的視野と判断力",layer:3},
      {label:"全体最適を考える設計力",layer:4},
      {label:"未来を見通す先見性",layer:5},
    ]},
  { id:"lq8", text:"ストレスを感じるのはどんな状況ですか？",
    options:[
      {label:"やるべきことが明確なのに実行できない",layer:1},
      {label:"データが不十分で正確な分析ができない",layer:2},
      {label:"戦略が定まらず方向性が見えない",layer:3},
      {label:"組織の仕組みが非効率で改善できない",layer:4},
      {label:"社会の変化に対応できず取り残される",layer:5},
    ]},
  { id:"lq9", text:"理想的なキャリアパスは？",
    options:[
      {label:"専門技術を極めたスペシャリスト",layer:1},
      {label:"データドリブンなアナリスト",layer:2},
      {label:"事業戦略を立案するストラテジスト",layer:3},
      {label:"組織全体を設計するCxO",layer:4},
      {label:"社会変革を牽引するビジョナリー",layer:5},
    ]},
  { id:"lq10", text:"あなたの思考が最も活性化するのは？",
    options:[
      {label:"具体的な課題に取り組んでいるとき",layer:1},
      {label:"複雑なデータの中からパターンを見つけたとき",layer:2},
      {label:"競争環境の中で勝ち筋を発見したとき",layer:3},
      {label:"複数の要素が噛み合うシステムを設計しているとき",layer:4},
      {label:"歴史的な転換点や文明の行方を考えているとき",layer:5},
    ]},
];

// ============================================================
// Processing Power Questions (10 logic trap questions)
// ============================================================
export const POWER_QUESTIONS: PowerQuestion[] = [
  { id:"pp1",
    text:"「すべてのAはBである。すべてのBはCである。」この前提から確実に言えることは？",
    options:[
      {label:"すべてのCはAである",correct:false,trapType:"逆の誤り"},
      {label:"すべてのAはCである",correct:true},
      {label:"一部のCはAである",correct:false,trapType:"不確定な推論"},
      {label:"AでないものはCでない",correct:false,trapType:"対偶の誤用"},
    ],
    explanation:"三段論法により「すべてのA→B→C」が成立するため、「すべてのAはCである」が正解。逆（C→A）は成立しない。" },
  { id:"pp2",
    text:"ある会社の売上が前年比20%増加し、コストが前年比30%増加した。利益について確実に言えることは？",
    options:[
      {label:"利益は必ず減少した",correct:false,trapType:"情報不足の断定"},
      {label:"利益が増加したか減少したかは、元の売上とコストの比率による",correct:true},
      {label:"利益は変わらない",correct:false,trapType:"誤った計算"},
      {label:"売上増加率がコスト増加率より低いので、必ず赤字になった",correct:false,trapType:"飛躍した結論"},
    ],
    explanation:"利益=売上-コストであり、増加率だけでは利益の増減は判断できない。元の絶対額が必要。" },
  { id:"pp3",
    text:"「雨が降ると道路が濡れる」が真であるとき、「道路が濡れている」から言えることは？",
    options:[
      {label:"雨が降った",correct:false,trapType:"後件肯定の誤り"},
      {label:"雨が降ったとは限らない（他の原因もありうる）",correct:true},
      {label:"雨が降っていない",correct:false,trapType:"否定の誤り"},
      {label:"必ず雨が降った、なぜなら他に道路が濡れる原因はないから",correct:false,trapType:"隠れた前提"},
    ],
    explanation:"「P→Q」が真でも「Q→P」は成立しない（後件肯定の誤謬）。散水車など他の原因もありうる。" },
  { id:"pp4",
    text:"10人のチームで、全員が「自分は平均以上の貢献をしている」と回答した。この結果から最も適切な解釈は？",
    options:[
      {label:"チーム全体のパフォーマンスが非常に高い",correct:false,trapType:"論理の飛躍"},
      {label:"認知バイアス（優越の錯覚）が働いている可能性が高い",correct:true},
      {label:"全員が正しく自己評価できている",correct:false,trapType:"統計的不可能性の無視"},
      {label:"アンケートの設計に問題がある",correct:false,trapType:"部分的正解"},
    ],
    explanation:"統計的に全員が平均以上であることは不可能。ダニング＝クルーガー効果や優越の錯覚が働いている。" },
  { id:"pp5",
    text:"ある薬の臨床試験で、服用群の80%が改善し、プラセボ群の75%も改善した。この薬の効果について言えることは？",
    options:[
      {label:"薬には明確な効果がある（80%が改善）",correct:false,trapType:"対照群の無視"},
      {label:"薬の効果は限定的であり、プラセボとの差はわずか5%にすぎない",correct:true},
      {label:"プラセボ効果が異常に高いので、試験自体が無効",correct:false,trapType:"過度な一般化"},
      {label:"80%の改善率は十分に高いので、薬は有効と結論できる",correct:false,trapType:"ベースラインの無視"},
    ],
    explanation:"対照群との差分（80%-75%=5%）が薬の真の効果。絶対値だけでなく相対比較が重要。" },
  { id:"pp6",
    text:"「成功した起業家の90%は毎朝5時に起きている」というデータがある。ここから言えることは？",
    options:[
      {label:"早起きすれば起業で成功する確率が上がる",correct:false,trapType:"因果の逆転"},
      {label:"成功した起業家には早起きの傾向があるが、因果関係は不明",correct:true},
      {label:"早起きは成功の必要条件である",correct:false,trapType:"相関と因果の混同"},
      {label:"残りの10%は例外であり、無視してよい",correct:false,trapType:"少数派の切り捨て"},
    ],
    explanation:"相関関係は因果関係を意味しない。成功→余裕→早起き、という逆の因果もありうる。" },
  { id:"pp7",
    text:"AさんとBさんが議論している。Aさん：「この政策は経済成長に寄与する」Bさん：「Aさんは大企業の利益しか考えていない」。Bさんの反論の問題点は？",
    options:[
      {label:"Bさんの指摘は正しい可能性がある",correct:false,trapType:"論点のすり替えの容認"},
      {label:"人身攻撃（アド・ホミネム）であり、政策の内容に反論していない",correct:true},
      {label:"Aさんの主張が曖昧なので、Bさんの反論は妥当",correct:false,trapType:"責任転嫁"},
      {label:"両者とも正しい",correct:false,trapType:"偽の中立"},
    ],
    explanation:"Bさんは政策の内容ではなくAさんの動機を攻撃しており、これは人身攻撃の誤謬。" },
  { id:"pp8",
    text:"コイン投げで5回連続で表が出た。次の1回で表が出る確率は？",
    options:[
      {label:"50%より低い（そろそろ裏が出るはず）",correct:false,trapType:"ギャンブラーの誤謬"},
      {label:"50%（各試行は独立）",correct:true},
      {label:"50%より高い（表が出やすいコインかもしれない）",correct:false,trapType:"不当な推論"},
      {label:"計算不能（情報が足りない）",correct:false,trapType:"過度な慎重さ"},
    ],
    explanation:"公正なコインの各試行は独立事象。過去の結果は次の確率に影響しない（ギャンブラーの誤謬）。" },
  { id:"pp9",
    text:"ある国で犯罪率が上昇し、同時期に警察官の数も増加した。最も適切な解釈は？",
    options:[
      {label:"警察官の増加が犯罪を誘発している",correct:false,trapType:"因果の逆転"},
      {label:"犯罪率の上昇に対応して警察官を増員した可能性がある",correct:true},
      {label:"両者に因果関係はなく、完全に無関係",correct:false,trapType:"関連性の完全否定"},
      {label:"警察官が増えても犯罪は減らないことが証明された",correct:false,trapType:"不当な結論"},
    ],
    explanation:"時系列的に犯罪増加→警察増員という因果の方向が自然。相関から安易に因果を断定してはいけない。" },
  { id:"pp10",
    text:"「この製品を使った人の95%が満足と回答」という広告がある。この主張を評価する上で最も重要な情報は？",
    options:[
      {label:"製品の価格",correct:false,trapType:"無関係な情報"},
      {label:"調査の対象者がどのように選ばれたか（サンプリング方法）",correct:true},
      {label:"競合製品の満足度",correct:false,trapType:"比較の罠"},
      {label:"回答者の年齢層",correct:false,trapType:"部分的関連"},
    ],
    explanation:"サンプリングバイアス（購入者のみ、自社サイトのみ等）があれば95%という数字は信頼できない。" },
];

// ============================================================
// Dynamic Shift Scenarios (3 scenarios, each with 3 phases)
// ============================================================
export const SHIFT_SCENARIOS: ShiftScenario[] = [
  { id:"ds1",
    situation:"あなたはスタートアップのCOOです。順調に成長していた事業に、突然大手企業が同じ市場に参入してきました。",
    phases:[
      { description:"参入の第一報を受けた直後、最初にとる行動は？",
        options:[
          {label:"チームに即座に状況を共有し、今日中にできる対策を実行する",layer:1,quality:60},
          {label:"大手の参入戦略を詳細に分析し、強みと弱みを特定する",layer:2,quality:80},
          {label:"自社の差別化戦略を再設計し、3ヶ月の対抗計画を立てる",layer:3,quality:90},
          {label:"市場構造全体の変化を予測し、新たなポジショニングを構想する",layer:4,quality:70},
        ]},
      { description:"1週間後、大手が価格競争を仕掛けてきた。次にとる行動は？",
        options:[
          {label:"即座に価格を下げて顧客の流出を防ぐ",layer:1,quality:40},
          {label:"顧客データを分析し、価格感度の低いセグメントを特定する",layer:2,quality:85},
          {label:"価格以外の価値（サービス品質、カスタマイズ性）で差別化する戦略を立てる",layer:3,quality:95},
          {label:"業界全体のエコシステムを再定義する新しいビジネスモデルを設計する",layer:4,quality:75},
        ]},
      { description:"3ヶ月後、市場シェアが安定してきた。長期的に考えるべきことは？",
        options:[
          {label:"現在の運用を最適化し、コスト効率を高める",layer:1,quality:50},
          {label:"競合の次の動きを予測するための情報収集体制を構築する",layer:2,quality:70},
          {label:"次の成長領域を特定し、先行投資の計画を立てる",layer:3,quality:80},
          {label:"業界の未来像を描き、5年後のポジションを設計する",layer:4,quality:95},
        ]},
    ]},
  { id:"ds2",
    situation:"あなたは大企業の部門長です。社内で大規模なDX（デジタルトランスフォーメーション）プロジェクトが始まりました。",
    phases:[
      { description:"プロジェクト開始時、あなたの最初のアクションは？",
        options:[
          {label:"部門内のタスクリストを作成し、担当者を割り当てる",layer:1,quality:50},
          {label:"現状の業務プロセスを詳細に分析し、ボトルネックを特定する",layer:2,quality:85},
          {label:"DXの目標を部門戦略と整合させ、優先順位を決定する",layer:3,quality:90},
          {label:"組織全体のデジタル成熟度を評価し、変革のロードマップを設計する",layer:4,quality:80},
        ]},
      { description:"導入3ヶ月後、現場から「使いにくい」「従来の方が早い」という声が上がった。どう対応する？",
        options:[
          {label:"現場の声を聞き、即座に使いやすさを改善する",layer:1,quality:70},
          {label:"利用データを分析し、どの機能が問題かを特定する",layer:2,quality:85},
          {label:"変革管理（チェンジマネジメント）の戦略を見直し、段階的な移行計画を再設計する",layer:3,quality:95},
          {label:"組織文化そのものを変革するための長期プログラムを設計する",layer:4,quality:75},
        ]},
      { description:"1年後、DXプロジェクトが一定の成果を出した。次に考えるべきことは？",
        options:[
          {label:"成果を定着させるための標準化とマニュアル整備",layer:1,quality:60},
          {label:"ROIを詳細に分析し、次の投資領域を特定する",layer:2,quality:75},
          {label:"デジタル技術を活用した新規事業の可能性を探る",layer:3,quality:85},
          {label:"業界全体のDXトレンドを踏まえ、次世代の組織モデルを構想する",layer:4,quality:95},
        ]},
    ]},
  { id:"ds3",
    situation:"あなたは教育機関の責任者です。AI技術の急速な進化により、従来の教育モデルの見直しが求められています。",
    phases:[
      { description:"AI教育への対応を求められた最初の段階で、あなたは？",
        options:[
          {label:"すぐにAIツールの導入研修を教員向けに実施する",layer:1,quality:50},
          {label:"他の教育機関のAI活用事例を調査・分析する",layer:2,quality:75},
          {label:"AIを活用した新しいカリキュラム戦略を設計する",layer:3,quality:90},
          {label:"AI時代に求められる人材像を定義し、教育システム全体を再設計する",layer:4,quality:85},
        ]},
      { description:"AI導入後、「学生がAIに頼りすぎて思考力が低下している」という懸念が出た。どう対応する？",
        options:[
          {label:"AI使用のガイドラインを即座に策定し、適用する",layer:1,quality:60},
          {label:"学生の学習データを分析し、AI依存度と学力の相関を検証する",layer:2,quality:90},
          {label:"AIと人間の思考を組み合わせた新しい教育メソッドを開発する",layer:3,quality:95},
          {label:"「AI時代の知性とは何か」を根本から再定義し、教育哲学を刷新する",layer:4,quality:80},
        ]},
      { description:"5年後を見据えて、教育機関として取り組むべきことは？",
        options:[
          {label:"最新のAIツールを常にアップデートし、実務スキルを教え続ける",layer:1,quality:40},
          {label:"卒業生の追跡調査を行い、教育効果を定量的に評価する",layer:2,quality:70},
          {label:"産業界との連携を強化し、実践的な教育プログラムを開発する",layer:3,quality:80},
          {label:"教育の本質的な目的を再定義し、人間にしかできない能力の育成に注力する",layer:4,quality:95},
        ]},
    ]},
];

// ============================================================
// Scoring helpers
// ============================================================

/** Determine Base Type from question answers */
export function calculateBaseType(answers: Record<string, string>): { type: BaseType; scores: Record<MBTIDimension, { first: number; second: number }> } {
  const dimScores: Record<MBTIDimension, { first: number; second: number }> = {
    EI: { first: 0, second: 0 },
    SN: { first: 0, second: 0 },
    TF: { first: 0, second: 0 },
    JP: { first: 0, second: 0 },
  };

  for (const q of BASE_TYPE_QUESTIONS) {
    const answer = answers[q.id];
    if (!answer) continue;
    if (answer === "A") {
      dimScores[q.dimension].first += 1;
    } else {
      dimScores[q.dimension].second += 1;
    }
  }

  const e = dimScores.EI.first >= dimScores.EI.second ? "E" : "I";
  const s = dimScores.SN.first >= dimScores.SN.second ? "S" : "N";
  const t = dimScores.TF.first >= dimScores.TF.second ? "T" : "F";
  const j = dimScores.JP.first >= dimScores.JP.second ? "J" : "P";

  return { type: `${e}${s}${t}${j}` as BaseType, scores: dimScores };
}

/** Determine primary Cognitive Layer from answers */
export function calculateLayer(answers: Record<string, number>): { layer: number; distribution: number[] } {
  const dist = [0, 0, 0, 0, 0]; // index 0=L1 ... 4=L5
  for (const val of Object.values(answers)) {
    if (val >= 1 && val <= 5) dist[val - 1] += 1;
  }
  const maxIdx = dist.indexOf(Math.max(...dist));
  return { layer: maxIdx + 1, distribution: dist };
}

/** Get top 2 layers (for hybrid layer detection) */
export function getTopLayers(distribution: number[]): { primary: number; secondary?: number; isHybrid: boolean } {
  // Find indices sorted by count (descending)
  const sorted = distribution
    .map((count, idx) => ({ layer: idx + 1, count }))
    .sort((a, b) => b.count - a.count);
  
  const primary = sorted[0]?.layer ?? 1;
  const secondary = sorted[1]?.layer;
  
  // If top 2 are equal or very close (within 1), it's a hybrid type
  const isHybrid = secondary !== undefined && sorted[0].count <= sorted[1].count + 1;
  
  return { primary, secondary: isHybrid ? secondary : undefined, isHybrid };
}

/** Calculate Processing Power score */
export function calculatePower(answers: Record<string, number>): { score: number; details: { correct: number; total: number } } {
  let correct = 0;
  const total = POWER_QUESTIONS.length;
  for (const q of POWER_QUESTIONS) {
    const ansIdx = answers[q.id];
    if (ansIdx !== undefined && q.options[ansIdx]?.correct) {
      correct += 1;
    }
  }
  return { score: Math.round((correct / total) * 100), details: { correct, total } };
}

/** Calculate Dynamic Shift score */
export function calculateShift(answers: Record<string, number[]>): { score: number; layerTransitions: number[]; adaptability: number } {
  let totalQuality = 0;
  let maxQuality = 0;
  const layerTransitions: number[] = [];

  for (const scenario of SHIFT_SCENARIOS) {
    const scenarioAnswers = answers[scenario.id];
    if (!scenarioAnswers) continue;
    const layers: number[] = [];
    for (let i = 0; i < scenario.phases.length; i++) {
      const choiceIdx = scenarioAnswers[i];
      if (choiceIdx !== undefined) {
        const option = scenario.phases[i].options[choiceIdx];
        if (option) {
          totalQuality += option.quality;
          layers.push(option.layer);
        }
      }
      maxQuality += 95; // max possible quality per phase
    }
    // Count layer transitions
    for (let i = 1; i < layers.length; i++) {
      if (layers[i] !== layers[i - 1]) layerTransitions.push(1);
      else layerTransitions.push(0);
    }
  }

  const score = maxQuality > 0 ? Math.round((totalQuality / maxQuality) * 100) : 0;
  const adaptability = layerTransitions.length > 0
    ? Math.round((layerTransitions.filter(t => t === 1).length / layerTransitions.length) * 100)
    : 0;

  return { score, layerTransitions, adaptability };
}

/** Get the 80-type name from base type and layer */
export function getTypeName(baseType: BaseType, layer: number): string {
  const names = TYPE_NAME_MATRIX[baseType];
  if (!names) return "不明";
  return names[Math.max(0, Math.min(4, layer - 1))] || "不明";
}

/** Get the type code e.g. "ENTP-L3" */
export function getTypeCode(baseType: BaseType, layer: number): string {
  return `${baseType}-L${layer}`;
}


// ============================================================
// Question Pattern Management (for multiple question sets)
// ============================================================

export interface QuestionPattern {
  patternId: string;
  questions: LayerQuestion[] | PowerQuestion[];
}

export interface ShiftPattern {
  patternId: string;
  scenarios: ShiftScenario[];
}

export interface PatternSet {
  layerPatterns: QuestionPattern[];
  powerPatterns: QuestionPattern[];
  shiftPatterns: ShiftPattern[];
}

/**
 * Select a random pattern from a list
 */
export function selectRandomPattern<T extends { patternId: string }>(
  patterns: T[]
): T {
  if (patterns.length === 0) {
    throw new Error("No patterns available");
  }
  return patterns[Math.floor(Math.random() * patterns.length)];
}

/**
 * Select random questions/scenarios from a pattern
 */
export function getQuestionsFromPattern(
  pattern: QuestionPattern
): LayerQuestion[] | PowerQuestion[] {
  return pattern.questions;
}

export function getScenariosFromPattern(pattern: ShiftPattern): ShiftScenario[] {
  return pattern.scenarios;
}
