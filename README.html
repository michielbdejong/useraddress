<h1>The Polyglot approach to the federated social web</h1>
    <h3>How do you mean, polyglot?</h3>
    <p>A polyglot is someone who speaks multiple languages reasonably well. Imagine we want peace on earth, and we decide that the way to achieve it is to make sure everybody can talk to everybody. One approach to this would be to develop Esperanto: a common language that is easy to learn for everybody, regardless of their native language. So far, a lot of work on the federated social web has followed the Esperanto approach.</p>
    <p>Another solution is to realise that we can be a network of friends first, regardless of which languages (if any) we have in common. Granted, if two people have no languages in common whatsoever, they can only wave and smile at each other and that's about it. But now imagine someone who speaks 5 or 6 languages (a polyglot). Such a person will be able to make a lot of friends on a lot of continents. Without those people from different continents having to decide to teach Esperanto in their schools.</p>
    <p>The polyglot approach to the federated social web recognizes xmpp, all the layers of the OStatus stack, but also email, and web linking as protocols ("languages") that can at one point or another help one application understand the information that another application (on another server) is exposing.</p>
    <h3>Why propose a new approach?</h3>
    <p>For a few years now, many projects have developed distributed social networks. These are in general server-side web applications which allow users to interact socially with each other, but in a way where different user accounts need not be hosted on the same server. There are about 40 different projects like this, including StatusNet, Diaspora, Friendica, BuddyCloud, Crabgrass, Apache Wave, to name but a few. If you include the ones that do not expose a web interface, then there are even more.
    </p><p>Because there are so many different such application, the 'federated social web' effort was started, to make not only servers that run the same application compatible (for instance, a Diaspora server is compatible with another Diaspora server), but also servers that happen to run different software (for instance, making a Friendica server compatible with a StatusNet server). A lot of compatibility can be achieved by using existing protocols and formats, like xmpp. A notable effort to define what a server should support in order to be compatible with other application is the OStatus stack.
    </p><p>Despite the apparent dichotomy between the xmpp and OStatus approaches, and despite the fact that only a subset of typical social application functionality was being described by these proposals, some valuable progress was made on this topic over the last two years. But in the end, it turned out to be quite hard to agree upfront on what federation protocol each server should implement. Choosing this protocol and agreeing on a choice with all parties involved is hard, and this is not a top-down organization; each application has its own development roadmap which often understandably takes priority over the more idealistic and long-term federation efforts.
    </p><p>In the late spring of 2012, some people started asking how we can move on from where we are now, as it was unclear how, if, and on what timescale the different application development teams would move any closer to each other on xmpp and OStatus. One thing we came up with in this discussion was that one social web does not have to mean one federation protocol. It can be a polyglot web.</p>
    <h3>Search as the cornerstone</h3>
    <p>One thing that is needed to make the whole web feel like one big social space, instead of facebook being one closed space, twitter being another, etcetera, is to create one big Mapa Mundi: a map of the world. We may not be able to talk much to many of the people in Sulawesi, or participate in their conversations, but at least we can see they're on the map, and it makes us remember we are all part of one world, and maybe one day we will take the step to learn a new language. At least by having a map of the whole world, we're not excluding any continents a priori.</p>
    <p>UserAddress is a search engine that can discover users as long as they are discoverable through one of the following languages:

    <ul>
      <li>xrd (e.g. Webfinger including StatusNet, Google+, Friendica, Diaspora)</li>
      <li>rdf (e.g. Foaf)</li>
      <li>html (e.g. Tantek, Melvin)</li>
      <li>turtle (e.g. Facebook)</li>
      <li><a href="https://dev.twitter.com/docs/api/1/get/users/show">Twitter-flavoured</a> json (Twitter)</li>
      <li>Planned: <a href="http://xmpp.org/extensions/xep-0054.html#sect-id229678">xmpp-vcard</a> (e.g. BuddyCloud)</li>
    </ul>
    Finding a user who has their account on another application is like smiling, in that you can do it without speaking the same language. After that, the language negotiation begins. Note the big difference here between the Polyglot approach and the Esperanto approach. With the Esperanto approach, if we don't both speak Esperanto, we will not even see each other. In the Polyglot approach, you see everyone, just maybe the communication tools are (at times, and at first) limited.
    </p><p>Once you have found the user you were looking for, you can see (given which languages they speak and which languages you speak), if and how you can communicate with each other.</p>
    <h3>The 'user address' query format</h3>
    <p>The software presented here is called UserAddress, and it is a search engine that produces search result rows in response to some search query. The search query can be given in two ways: free text, or user address. If you input free text, it will heuristically try to find the best matches it can come up with, based on the search index that it has cached. If you give it a user address, it will deterministically return the information it could find about that user (if any).</p>
    <p>A user address can take one of two formats: user@host, or the URL of a document describing the user. The notation {user}@{host} is considered shorthand for https://{host}/.well-known/host-meta?resource=acct:{user}@{host}, as per <a href="http://tools.ietf.org/html/draft-ietf-appsawg-webfinger-00">webfinger-00</a>.</p>
    <p>URI-purists are allowed to follow the hash-URI rule and the 303s-rule when publishing their profiles, but this is no requirement. Even if you don't follow either of these rules, your profile will still show up in search results. Note however, that if you give UserAddress a URI that is not a URL, it will have no way to discover information. Also note that the URL has to resolve to a document with html, rdf, xrd, turtle or Twitter-flavoured json content, and have either http or https as its protocol (because those are the only ones we implemented for retrieval).</p>
    <h3>Tools</h3> In order to create some structure, UserAddress considers 4 types of communication: reading, subscribing, commenting, and messaging.
    <h3>Reading</h3>
    Something that is almost always possible is reading another person's public information. This can be their profile, maybe with a photo, some description of their hobbies and interests, and also maybe a blog, some photo albums, some videos or podcast episodes they uploaded, etcetera.
    <h3>Subscribing</h3>
    The next step is subscribing to content from a person. This means that whenever they publish something new that is accessible to you, you receive a notification. This can take many forms, for instance microblogging like on twitter, but also getting a notification that there is a new comment on a photo you were tagged in. Also notifications that indicate if the person is online, busy, or offline, are useful and used by many applications to show who is online right now. Such notifications are also something you subscribe to and that pro-actively sends you a notification if you are subscribed. This model is often called the pub-sub (publication-subscription) model.
    <h3>Commenting</h3>
    Of course you can always comment on what you read by just linking to it. But several social networks provide a means for others to publically comment on someone's profile. This is often done on blogs (a special comments section below each blogpost), and of course the Facebook wall was a good example of a profile page that is made up primarily of what other people write on it. Sometimes a person may want to moderate what people comment on their page, and obviously the owner of the profile always retains the right to delete comments. Also, comments are not necessarily public, there are also situations where your friends are allowed to write on your wall, but also only your friends will be able to view your wall. All of this is categorized as 'commenting'.
    <h3>Messaging</h3>
    A valuable way of communicating on the social web is by private message. This can be a text message, a link to some other content, but even a voice call or video chat is really just a form of messaging. Whether they will be able to reply to your message is left undefined here. What is also left undefined is whether the message will fail (like with chat) or be queued up (like with email) if the person is currently offline, and whether delivery can be guaranteed. All forms of sending some sort of information directly to a recipient are categorized as messaging by UserAddress.
    <h3>Other info</h3>
    Apart from the tools supported by a given account, UserAddress also returns some basic info that will make it easier to recognize whether you have really found the right Joe Bloggs, and not some other person who happens to have the same name:
    <ul>
      <li>avatar (a small photo, often but not necessarily of the person's face). format: an image URL</li>
      <li>full name (often the person's real name, but doesn't have to be). format: a text string</li>
      <li>follows (links to people this person follows according to their public profile). format: array of user addresses</li>
      <li>type (always 'user', in case we later want to return results of type 'group' or 'content')</li>
      <li>Planned: gender ('male' or 'female')</li>
      <li>Planned: locale (something like 'en' or 'en_US')</li>
      <li>Planned: location (geo coordinates probably)</li>
    </ul>
    <h3>Project status</h3>
    <p>The current implementation of UserAddress is at <a href="https://github.com/unhosted/useraddress">gh:unhosted/useradddress</a>. <strong>This is only a proof-of-concept, not production-ready.</strong> We will discuss on in the fedsocweb CG what should be done with it. If we decide we want to run this as a production service, then we need to find someone who can do that (probably one person full-time), and get funding for it.</p>
    <h3>Cross-origin services</h3>
    <p>Since we are in the business of breaking down domain barriers, this service works over a WebSocket (sockjs-compatible) that has no same-origin policy. That means you can create a widget on any web app, no matter whether it's hosted (server-side) or unhosted (client-side), and query the central index server from there. You may of course also run a local instance, but if we set up one central service, then we have the benefit of scaling the index nicely, and have better heuristic results on free-text name searches. The Websocket responds incrementally on anything you send it, so it's easy to use it for as-you-type search. You may also combine it with a local (logged-in) search on the app, so that public results get mixed with private logged-in search results.</p>
    <h3>Demo</h3>
    <p>A little demo is below. It has no error reporting yet, and may fail without warning. Remember, this is only a proof-of-concept, not even an alpha service. But at least the examples should work.</p>
     <div id="searchWidget" style="display:block">
       <h3>To prime, search something like:</h3>
       <ul>
       <li>michielbdejong@identi.ca</li>
       <li>michiel@revolutionari.es</li>
       <li>dejong.michiel@gmail.com</li>
       <li>https://api.twitter.com/1/users/show.json?screen_name=michielbdejong</li>
       <li>https://graph.facebook.com/dejong.michiel</li>
       <li>michielbdejong@joindiaspora.com</li>
       <li>http://melvincarvalho.com/#me</li>
       <li>http://tantek.com/</li>
       <li>http://www.w3.org/People/Berners-Lee/card.rdf#i</li>
       </ul>
       <h3>or (once primed) free text.</h3>
        <input onkeyup="key();" id="in">  
        <span id="spinner" style="display:none"><h3>hmmmmmm...</h3></span>
        <ul id="results"></ul>
        <h3>Legend:</h3>
        <ul>
          <li>(U)SER/(T)OPIC - indicates if this is considered a user or a topic (group, channel, page, hangout, teleconference, &hellip;)</li>
          <li>(R)EAD - read (visit) this person's or topic's web page, blog, profile, timeline, channel archive, &hellip;</li>
          <li>(C)OMMENT - leave a comment on this person's or topic's blog, wiki, wall, channel, &hellip;</li>
          <li>(S)UBSCRIBE - get notified about updates and streamed content from this user or topic. Updates may be text (online/offline status, ActivityStreams) or media (like podcasts), but two-way conversations like (video) chat fall under message, because it's not subscribing to a pre-existing feed.</li>
          <li>(M)ESSAGE - send a one-off message to this user. This may be a chat message, an email-like message, but also an attempt to initiate a voice or video call</li>
        </ul>
      </div>
