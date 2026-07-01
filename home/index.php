<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>redderblanket</title>
    <style>
        body { background: #8fceff; margin: 0; }
        img { width: 100%; border: 4px outset #eee; box-sizing: border-box; }
        main { margin: auto; background: white; width: 40em; min-height: 100vh; padding: 1em; }
        a:not([href]) { color: inherit; }
        figure { margin: 0; }
        figcaption, .small { font-size: smaller; color: grey; text-align: center; }
        .gallery { display: grid; grid-template-columns: 1fr 1fr; gap: 1em; }
    </style>
</head>
<body>
    <main>
        <h1>RedderBlanket</h1>
        <p>I've been drawing BBW/hyper for roughly 2 years. I especially like public sizediff. I want to make more sequences/short webcomics. I'm a <i>huge</i> perfectionist.</p>
        <p>I'm making this site in part in case DeviantArt screws me over. I don't plan on hosting all my art here, just the art that I'd like people to see, give or take.</p>

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

        <div class="gallery">
            <?php
                <a href="[URL]">
                    <figure>
                        <img src="[URL]">
                        <figcaption>[FILENAME]</figcaption>
                    </figure>
                </a>
            ?>
        </div>

        <p class="small">
            <a [PREV_PAGE_HREF]>[<-]</a>
            Page [PAGE_NUMBER]/[PAGE_COUNT]
            <a [NEXT_PAGE_HREF]>[->]</a>
        </p>
    </main>
</body>
</html>