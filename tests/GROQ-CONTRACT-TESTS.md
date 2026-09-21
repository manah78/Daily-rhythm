# Groq/Qwen contract smoke tests

After deployment, test `/api/interpret-command` with these cases.

## 1. Multi-activity English
`Swimming at 7, breakfast at 8, call my uncle at 9, work on Daily Rhythm, gym at 6, sleep at 11.`

Expected: six ADD operations; Work on Daily Rhythm is untimed.

## 2. Lebanese / mixed language
`بكرا بدي روح عالجيم عالسبعة، وبعدها بدي مرق جيب الولاد، الفطور عالثمانية، وبدي اشتغل على Daily Rhythm، وبعدين اتصل بأخي حوالي العشرة، والنوم عالـ11`

Expected: all six activities recovered. Approximate 10 should remain approximate. Untimed activities must not be dropped.

## 3. Mixed operations
`بكرا ضيف السباحة عالسبعة، غيّر الجيم من الستة للثمانية، واحذف المشي، وبعدها بدي اشتغل على Daily Rhythm شوي، واتصل بأمي حوالي العشرة، والنوم عالـ11`

Expected: add Swimming, edit Gym, delete Walking, add Work on Daily Rhythm, add Call mother, add Sleep.

## 4. Semantic timing
`احذف الجيم، وغيّر الاجتماع وخليه بعد الغدا، وضيف مكالمة مع سامي بالليل، وضيف السباحة بعد صلاة الظهر، وخلي القراءة قبل النوم، وبدي أمشي بين العصر والمغرب، والعشا حوالي الثمانية، وضيف شغلة اسمها Work on Daily Rhythm بدون وقت`

Expected timing meanings: after_activity, day_period, after_prayer, before_activity, between, approximate_time, untimed.

Release gate for destructive behavior: no DELETE/EDIT should execute without a unique verified schedule target.
