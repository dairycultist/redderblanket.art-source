<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>redderblanket</title>
    <style>
        body { background: #8fceff; margin: 0; }
        img { width: 100%; border: 4px outset #eee; }
        main { margin: auto; background: white; width: 40em; min-height: 100vh; padding: 1em; }
        a:not([href]) { color: inherit; }
        figcaption, .small { font-size: smaller; color: grey; text-align: center; }
        figcaption { font-size: smaller; color: grey; max-width: 15em; margin: auto; }
    </style>
</head>
<body>
    <main>
        <h1>RedderBlanket</h1>
        <p>I've been drawing BBW/hyper for roughly 2 years. I want to make more sequences/short webcomics. I don't plan on hosting all my art here, just the art that I'd like people to see, give or take :0</p>
        
        <p>Drawing makes me happy :) and stressed :( but mostly happy :D</p>
        <p>I don't like my art's availability being at the whim of some megasite, so I'm soft-launching the migration to MY site that has zero SEO!</p>

        <form action="index.php" style="text-align: center; background: #143b61; padding: 4px;">
            <input type="text" name="search" placeholder="[SEARCH]">
            <input type="submit" value="Search">
        </form>
        <p class="small">[TOTAL] results</p>
        <p class="small">
            <a [PREV_PAGE_HREF]>[<-]</a>
            Page [PAGE_NUMBER]/[PAGE_COUNT]
            <a [NEXT_PAGE_HREF]>[->]</a>
        </p>

        <div style="display: grid; grid-template-columns: 1fr 1fr;">
            <?php
                <a href="[URL]">
                    <figure>
                        <img src="[URL]">
                        <figcaption>[FILENAME]</figcaption>
                    </figure>
                </a>
            ?>
        </div>
    </main>
</body>
</html>