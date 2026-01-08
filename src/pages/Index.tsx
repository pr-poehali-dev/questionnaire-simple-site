import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const { toast } = useToast();
  const [questions, setQuestions] = useState<Record<number, string>>({});
  const [answers, setAnswers] = useState<Record<number, string>>({});
  
  const totalQuestions = 100;
  const answeredQuestions = Object.keys(answers).filter(key => answers[parseInt(key)]?.trim()).length;
  const progress = (answeredQuestions / totalQuestions) * 100;

  const handleQuestionChange = (questionNumber: number, value: string) => {
    setQuestions(prev => ({
      ...prev,
      [questionNumber]: value
    }));
  };

  const handleAnswerChange = (questionNumber: number, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionNumber]: value
    }));
  };

  const handleSubmit = () => {
    if (answeredQuestions < totalQuestions) {
      toast({
        title: "Не все вопросы заполнены",
        description: `Осталось ответить: ${totalQuestions - answeredQuestions}`,
        variant: "destructive"
      });
      return;
    }

    const resultsText = Array.from({ length: totalQuestions }, (_, i) => i + 1)
      .map(num => {
        const question = questions[num] || `Вопрос ${num}`;
        const answer = answers[num] || '';
        return `${num}. ${question}\nОтвет: ${answer}`;
      })
      .join('\n\n');

    const blob = new Blob([resultsText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'answers.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Ответы сохранены",
      description: "Файл с ответами загружен на ваше устройство"
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl font-bold tracking-tight text-foreground mb-3">
            Анкета
          </h1>
          <p className="text-muted-foreground text-lg">
            Ответьте на все 100 вопросов
          </p>
        </div>

        <Card className="p-6 mb-8 animate-scale-in">
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Прогресс заполнения</span>
              <span className="font-medium text-foreground">
                {answeredQuestions} / {totalQuestions}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </Card>

        <div className="space-y-6 mb-8">
          {Array.from({ length: totalQuestions }, (_, i) => i + 1).map((num) => (
            <Card 
              key={num} 
              className="p-6 hover:shadow-md transition-shadow animate-fade-in"
              style={{ animationDelay: `${Math.min(num * 20, 500)}ms` }}
            >
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-medium">
                    {num}
                  </span>
                  <Input
                    placeholder={`Вопрос ${num}`}
                    value={questions[num] || ''}
                    onChange={(e) => handleQuestionChange(num, e.target.value)}
                    className="flex-1 font-medium"
                  />
                </div>
                <Textarea
                  placeholder="Введите ваш ответ..."
                  value={answers[num] || ''}
                  onChange={(e) => handleAnswerChange(num, e.target.value)}
                  className="min-h-[80px] resize-none"
                />
              </div>
            </Card>
          ))}
        </div>

        <Card className="p-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Icon name="Mail" className="text-primary" size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Контактная информация</h3>
              <p className="text-muted-foreground mb-3">
                После заполнения анкеты отправьте файл с ответами на указанный адрес
              </p>
              <div className="flex items-center gap-2 text-sm">
                <Icon name="Mail" size={16} className="text-muted-foreground" />
                <a 
                  href="mailto:contact@example.com" 
                  className="text-primary hover:underline"
                >
                  contact@example.com
                </a>
              </div>
            </div>
          </div>
        </Card>

        <div className="flex justify-center">
          <Button 
            onClick={handleSubmit}
            size="lg"
            className="px-8 hover-scale"
          >
            <Icon name="Download" className="mr-2" size={20} />
            Скачать ответы
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;